// frontend/src/components/dashboard/TipOfTheDay.tsx
export function TipOfTheDay() {
    return (
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-semibold text-sm">Tip of the Day</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
                Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                It keeps your answers structured and memorable.
            </p>
        </div>
    );
}