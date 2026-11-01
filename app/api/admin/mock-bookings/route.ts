import { learningAdmin } from '@/lib/learning/permissions';
import { requestBody, studentEndpoint, fail } from '@/lib/student/security';
import { slots, registrations, publishSlot, setSlotOpen } from '@/lib/mock-bookings/service';
export const runtime = 'nodejs';
export async function GET() { return studentEndpoint(async () => { await learningAdmin(); return { slots: (await slots(true)), registrations: (await registrations()) }; }); }
export async function POST(request: Request) {
    return studentEndpoint(async () => {
        const admin = await learningAdmin(), data = await requestBody(request);
        if (data.action === 'publish') return (await publishSlot(admin.id, data));
        if (data.action === 'set-open') return (await setSlotOpen(data.id, data.open));
        fail(400, 'Invalid mock booking action.');
    });
}
