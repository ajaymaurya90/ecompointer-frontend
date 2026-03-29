type StatCardProps = {
    title: string;
    value: string;
};

const StatCard = ({ title, value }: StatCardProps) => {
    return (
        <div className="group relative rounded-3xl app-card interactive-card p-6">
            <div className="h-1.5 w-16 rounded-full bg-primary mb-5"></div>

            <div className="relative z-10">
                <p className="text-xs uppercase tracking-wide text-textSecondary">
                    {title}
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight app-text-primary">
                    {value}
                </h2>
            </div>
        </div>
    );
};

export default StatCard;