"""Read-only source capture and lossless export. Never imports application startup code."""
import argparse, base64, hashlib, json, pathlib, shutil, sqlite3, struct, subprocess, os

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def tagged(v):
    if v is None:return ['null',None]
    if isinstance(v,int):return ['integer',str(v)]
    if isinstance(v,float):return ['real',struct.pack('>d',v).hex()]
    if isinstance(v,bytes):return ['blob',base64.b64encode(v).decode()]
    return ['text',v]

def canonical(v):return json.dumps(v,ensure_ascii=False,separators=(',',':')).encode('utf8')

def capture(src,out):
    if not src.is_file():raise ValueError('Source database is missing')
    for i in range(5):
        stage=out.parent/('capture-'+src.name+'-'+str(i));stage.mkdir(exist_ok=False)
        group=[src]+[pathlib.Path(str(src)+s) for s in ['-wal','-shm','-journal'] if pathlib.Path(str(src)+s).exists()]
        fingerprints={str(p):sha(p) for p in group}
        for p in group:shutil.copy2(p,stage/p.name)
        if not all(p.exists() and sha(p)==fingerprints[str(p)]==sha(stage/p.name) for p in group):continue
        if pathlib.Path(str(src)+'-wal').exists()!=any(str(p).endswith('-wal') for p in group):continue
        original=sqlite3.connect(stage/src.name);dest=sqlite3.connect(out)
        original.backup(dest);dest.close();original.close();return
    raise ValueError('Source is changing too quickly for nonintrusive capture; stop writes explicitly before retry')

def export(src,folder):
    folder.mkdir(exist_ok=False)
    snapshot=folder/'source.sqlite';capture(src,snapshot)
    con=sqlite3.connect(snapshot.as_uri()+'?mode=ro&immutable=1',uri=True);con.row_factory=sqlite3.Row
    integrity=con.execute('PRAGMA integrity_check').fetchall()
    if [r[0] for r in integrity]!=['ok'] or con.execute('PRAGMA foreign_key_check').fetchall():raise ValueError('Source integrity verification failed')
    objects=[dict(r) for r in con.execute("SELECT type,name,tbl_name,sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name")]
    tables=[]
    for obj in objects:
        if obj['type']!='table':continue
        name=obj['name'];q='"'+name.replace('"','""')+'"'
        columns=[dict(r) for r in con.execute('PRAGMA table_xinfo('+q+')')]
        if any(c['hidden'] for c in columns):raise ValueError('Generated/hidden source columns require explicit adaptation: '+name)
        pk=[c['name'] for c in sorted(columns,key=lambda c:c['pk']) if c['pk']]
        indexes=[]
        for idx in con.execute('PRAGMA index_list('+q+')').fetchall():
            d=dict(idx);d['columns']=[dict(r) for r in con.execute('PRAGMA index_xinfo("'+idx['name'].replace('"','""')+'")')];indexes.append(d)
        filename=name+'.jsonl';h=hashlib.sha256();count=0
        order=','.join('"'+p.replace('"','""')+'"' for p in pk) if pk else 'rowid'
        with (folder/filename).open('xb') as f:
            for row in con.execute('SELECT * FROM '+q+' ORDER BY '+order):
                data=canonical([tagged(v) for v in row])+b'\n';h.update(data);f.write(data);count+=1
        tables.append({'name':name,'sql':obj['sql'],'columns':columns,'primaryKey':pk,'indexes':indexes,'foreignKeys':[dict(r) for r in con.execute('PRAGMA foreign_key_list('+q+')')],'rows':count,'dataFile':filename,'sha256':h.hexdigest()})
    con.close()
    result={'sourceName':src.name,'snapshotSha256':sha(snapshot),'sqliteVersion':sqlite3.sqlite_version,'objects':objects,'tables':tables}
    (folder/'manifest.json').write_bytes(canonical(result))
    return {'name':folder.name,'tables':len(tables),'rows':sum(t['rows'] for t in tables),'manifestSha256':sha(folder/'manifest.json')}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--results',required=True);p.add_argument('--students',required=True);p.add_argument('--output',required=True)
    a=p.parse_args();out=pathlib.Path(a.output).resolve()
    if any(q.name.startswith('COMPLETE_WEBSITE_BACKUP') for q in [out,*out.parents]):raise ValueError('The protected complete backup must remain unchanged')
    for source in [pathlib.Path(a.results).resolve(),pathlib.Path(a.students).resolve()]:
        for parent in source.parents:
            if (parent/'package.json').exists() and out.is_relative_to(parent/'public'):raise ValueError('Exports must never be written to public storage')
    out.mkdir(exist_ok=False)
    if os.name=='nt':
        who=subprocess.check_output(['whoami'],text=True).strip()
        r=subprocess.run(['icacls',str(out),'/inheritance:r','/grant:r',who+':(OI)(CI)F','SYSTEM:(OI)(CI)F'],capture_output=True)
        if r.returncode:raise ValueError('Unable to protect export directory')
    else:out.chmod(0o700)
    summary=[export(pathlib.Path(a.results).resolve(),out/'results'),export(pathlib.Path(a.students).resolve(),out/'students')]
    (out/'export-summary.json').write_bytes(canonical(summary));print(json.dumps(summary))
if __name__=='__main__':main()
