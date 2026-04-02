"use client";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function OrderNotesCard({ value, onChange }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                <p className="text-sm text-gray-500">
                    Add optional notes for delivery, handling, or internal context.
                </p>
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={5}
                placeholder="Enter optional order notes"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
        </div>
    );
}