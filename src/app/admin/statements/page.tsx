'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminStatementsPage() {
    const [statements, setStatements] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [ministerId, setMinisterId] = useState('');
    const router = useRouter();

    const loadStatements = async () => {
        const res = await fetch('/api/admin/statements');
        const data = await res.json();
        setStatements(data);
    };

    useEffect(() => {
        loadStatements();
    }, []);

    const createStatement = async () => {
        if (!content || !ministerId) return alert('Content and Minister ID required');
        await fetch('/api/admin/statements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, ministerId: Number(ministerId) }),
        });
        setContent('');
        setMinisterId('');
        loadStatements();
    };

    const updateStatement = async (id: number) => {
        const newContent = prompt('New content:');
        if (!newContent) return;
        await fetch('/api/admin/statements', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, content: newContent }),
        });
        loadStatements();
    };

    const deleteStatement = async (id: number) => {
        if (!confirm('Delete this statement?')) return;
        await fetch(`/api/admin/statements?id=${id}`, { method: 'DELETE' });
        loadStatements();
    };

    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin – Statements Management</h1>

            {/* Create form */}
            <div className="mb-8 p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">Add New Statement</h2>
                <textarea
                    placeholder="Statement content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="number"
                    placeholder="Minister ID"
                    value={ministerId}
                    onChange={e => setMinisterId(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <button
                    onClick={createStatement}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Create
                </button>
            </div>

            {/* List */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Content</th>
                        <th className="border p-2">Minister ID</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {statements.map(s => (
                        <tr key={s.id}>
                            <td className="border p-2">{s.id}</td>
                            <td className="border p-2">{s.content}</td>
                            <td className="border p-2">{s.ministerId ?? '—'}</td>
                            <td className="border p-2 space-x-2">
                                <button
                                    onClick={() => updateStatement(s.id)}
                                    className="px-2 py-1 bg-amber-500 text-white rounded"
                                >Edit</button>
                                <button
                                    onClick={() => deleteStatement(s.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded"
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
