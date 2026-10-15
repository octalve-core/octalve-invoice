"use client";

import { useState } from "react";
import {
  X,
  Check,
  CreditCard,
  FileText,
  Building2,
  Lock,
  ChevronRight,
} from "lucide-react";

interface GettingStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tasks = [
  { id: 1, label: "Set Up Online Payment", icon: CreditCard, completed: false },
  {
    id: 2,
    label: "Customize Invoice Template",
    icon: FileText,
    completed: false,
  },
  {
    id: 3,
    label: "Add Business Information",
    icon: Building2,
    completed: false,
  },
  { id: 4, label: "Set Up App lock", icon: Lock, completed: false },
];

export default function GettingStartedModal({
  isOpen,
  onClose,
}: GettingStartedModalProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleTask = (taskId: number) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto safe-area-bottom">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full bg-[#E8F5E8] flex items-center justify-center">
                <span className="text-[#41B63E] text-sm font-bold">👋</span>
              </span>
              <h2 className="font-semibold text-gray-900">Hello Abdulsamad!</h2>
            </div>
            <p className="text-sm text-gray-500">
              Simplify Your Invoicing Process with This Personalized Checklist
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">
              {progressPercent}% Task Completed
            </span>
            <button className="text-[#41B63E] font-medium">View Tasks</button>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#41B63E] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="px-5 pb-6">
          <ul className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              const Icon = task.icon;

              return (
                <li key={task.id}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#41B63E] transition-colors"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-[#41B63E] border-[#41B63E]"
                          : "border-gray-300"
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span
                      className={`flex-1 text-left text-sm font-medium ${
                        isCompleted
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {task.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
