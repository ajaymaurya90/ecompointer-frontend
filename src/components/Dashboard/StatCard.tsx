type StatCardProps = {
    title: string;
    value: string;
};

const StatCard = ({ title, value }: StatCardProps) => {
    return (
        <div className="bg-white shadow rounded-xl p-6 border">
            <p className="text-sm text-gray-500 mb-2">{title}</p>
            <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
        </div>
    );
};

export default StatCard;