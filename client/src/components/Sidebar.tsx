// src/components/Sidebar.tsx
export default function Sidebar() {
    return (
        <aside className="w-64 h-full bg-white border-r p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Dionysus</h2>
            <div className="mb-6">
                <p className="text-gray-500 mb-2">Application</p>
                <ul className="space-y-2">
                    <li className="font-semibold text-blue-600">Dashboard</li>
                    <li>Q&A</li>
                    <li>Meetings</li>
                    <li>Billing</li>
                </ul>
            </div>
            <div className="mb-4">
                <p className="text-gray-500 mb-2">Your Projects</p>
                <ul className="space-y-2">
                    <li className="bg-gray-100 p-2 rounded">Docker Py</li>
                    <li className="bg-gray-100 p-2 rounded">Docker Gen AI</li>
                    <li className="bg-gray-100 p-2 rounded">ChatPDF</li>
                </ul>
            </div>
            <button className="mt-auto bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                + Create Project
            </button>
        </aside>
    );
}
