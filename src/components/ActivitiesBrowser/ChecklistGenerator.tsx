import React, { useState } from 'react';
import {
  CheckSquare,
  Package,
  BookOpen,
  Brain,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
} from 'lucide-react';
import { ActivitiesService, type ActivityResponse } from '@/generated-api';

interface ChecklistSectionProps {
  title: string;
  icon: React.ElementType;
  items: string[];
  isExpanded: boolean;
  onToggle: () => void;
  colorClass: string;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  title,
  icon: Icon,
  items,
  isExpanded,
  onToggle,
  colorClass,
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between p-3 transition-all duration-200 hover:bg-gray-50 ${
        isExpanded ? 'border-b border-gray-200' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`rounded-lg p-1.5 ${colorClass}`}>
          <Icon size={16} />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">{items.length} items</p>
        </div>
      </div>
      {isExpanded ? (
        <ChevronUp size={16} className="text-gray-400" />
      ) : (
        <ChevronDown size={16} className="text-gray-400" />
      )}
    </button>

    {isExpanded && (
      <div className="p-3 pt-0">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></div>
              <span className="text-xs leading-relaxed text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

interface ChecklistGeneratorProps {
  activity: ActivityResponse;
  onActivityUpdate: (updatedActivity: ActivityResponse) => void;
}

export default function ChecklistGenerator({
  activity,
  onActivityUpdate,
}: ChecklistGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasChecklist, setHasChecklist] = useState(
    Boolean(
      activity.equipment?.length || activity.instructions?.length || activity.adhd_tips?.length
    )
  );
  const [expandedSections, setExpandedSections] = useState({
    equipment: false,
    instructions: false,
    adhd_tips: false,
  });
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGenerateChecklist = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const updatedActivity =
        await ActivitiesService.createChecklistApiV1ActivitiesActivityIdChecklistPost({
          activityId: activity.id,
        });

      onActivityUpdate(updatedActivity);
      setHasChecklist(true);
      // Auto-expand sections after generation
      setExpandedSections({
        equipment: true,
        instructions: true,
        adhd_tips: true,
      });
    } catch (err) {
      setError('Failed to generate checklist. Please try again.');
      console.error('Error generating checklist:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateChecklist = async () => {
    await handleGenerateChecklist();
  };

  React.useEffect(() => {
    const hasData = Boolean(
      activity.equipment?.length || activity.instructions?.length || activity.adhd_tips?.length
    );
    setHasChecklist(hasData);
  }, [activity.equipment, activity.instructions, activity.adhd_tips]);

  if (!hasChecklist) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <CheckSquare size={24} className="text-blue-600" />
          </div>

          <h4 className="mb-2 text-lg font-semibold text-gray-900">Generate Activity Checklist</h4>

          <p className="mx-auto mb-4 max-w-md text-sm text-gray-600">
            Get personalized equipment lists, step-by-step instructions, and ADHD-friendly tips.
          </p>

          <div className="mb-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Package size={14} className="text-blue-500" />
              <span>Equipment</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <BookOpen size={14} className="text-green-500" />
              <span>Instructions</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Brain size={14} className="text-purple-500" />
              <span>ADHD Tips</span>
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerateChecklist}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Checklist</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare size={18} className="text-green-600" />
          <div>
            <h4 className="font-medium text-gray-900">Activity Checklist Generated</h4>
            <p className="text-xs text-gray-600">Everything you need to get started</p>
          </div>
        </div>

        <button
          onClick={handleRegenerateChecklist}
          disabled={isGenerating}
          className="inline-flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {isGenerating ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <RefreshCw size={12} />
              <span>Regenerate</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2">
          <div className="flex items-center space-x-2">
            <X size={14} className="text-red-500" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Compact Checklist Sections */}
      <div className="space-y-3">
        {activity.equipment && activity.equipment.length > 0 && (
          <ChecklistSection
            title="Equipment & Materials"
            icon={Package}
            items={activity.equipment}
            isExpanded={expandedSections.equipment}
            onToggle={() => toggleSection('equipment')}
            colorClass="bg-blue-50 border-blue-200 text-blue-700"
          />
        )}

        {activity.instructions && activity.instructions.length > 0 && (
          <ChecklistSection
            title="Step-by-Step Instructions"
            icon={BookOpen}
            items={activity.instructions}
            isExpanded={expandedSections.instructions}
            onToggle={() => toggleSection('instructions')}
            colorClass="bg-green-50 border-green-200 text-green-700"
          />
        )}

        {activity.adhd_tips && activity.adhd_tips.length > 0 && (
          <ChecklistSection
            title="ADHD-Friendly Tips"
            icon={Brain}
            items={activity.adhd_tips}
            isExpanded={expandedSections.adhd_tips}
            onToggle={() => toggleSection('adhd_tips')}
            colorClass="bg-purple-50 border-purple-200 text-purple-700"
          />
        )}
      </div>

      {/* Compact Summary */}
      <div className="rounded-lg bg-gray-50 p-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{activity.equipment?.length || 0}</div>
            <div className="text-xs text-gray-600">Equipment</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {activity.instructions?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Steps</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {activity.adhd_tips?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Tips</div>
          </div>
        </div>
      </div>
    </div>
  );
}
