export const dynamic = "force-dynamic";

import { ClientComponent } from "@/app/ClientComponent";
import { api } from "@/lib/api";

export default async function Home() {
    const response = await api.helloWorld({
        name: "Example",
    });
    return (
        <main className="p-24">
            {response.message}
            <ClientComponent />
        </main>
    );
}