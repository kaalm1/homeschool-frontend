import { useState } from 'react';
import { 
  WeekActivitiesService, 
  type WeekActivityResponse, 
  type WeekActivityUpdate 
} from '@/generated-api';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Wrench, 
  BookOpen, 
  Brain,
  Trash2 
} from 'lucide-react';

interface ActivityChecklistManagerProps {
  weekActivity: WeekActivityResponse;
  onUpdate: (updatedActivity: WeekActivityResponse) => void;
  readOnly?: boolean;
}

interface ChecklistSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  doneItems: string[];
  itemsKey: keyof WeekActivityResponse;
  doneKey: keyof WeekActivityResponse;
  activityItemsKey: keyof WeekActivityResponse;
  placeholder: string;
  color: string;
}

export default function ActivityChecklistManager({ 
  weekActivity, 
  onUpdate, 
  readOnly = false 
}: ActivityChecklistManagerProps) {
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const sections: ChecklistSection[] = [
    {
      title: 'Equipment',
      icon: Wrench,
      items: weekActivity.equipment || weekActivity.activity_equipment || [],
      doneItems: weekActivity.equipment_done || [],
      itemsKey: 'equipment',
      doneKey: 'equipment_done',
      activityItemsKey: 'activity_equipment',
      placeholder: 'Add equipment needed...',
      color: 'blue'
    },
    {
      title: 'Instructions',
      icon: BookOpen,
      items: weekActivity.instructions || weekActivity.activity_instructions || [],
      doneItems: weekActivity.instructions_done || [],
      itemsKey: 'instructions',
      doneKey: 'instructions_done',
      activityItemsKey: 'activity_instructions',
      placeholder: 'Add instruction step...',
      color: 'green'
    },
    {
      title: 'ADHD Tips',
      icon: Brain,
      items: weekActivity.adhd_tips || weekActivity.activity_adhd_tips || [],
      doneItems: weekActivity.adhd_tips_done || [],
      itemsKey: 'adhd_tips',
      doneKey: 'adhd_tips_done',
      activityItemsKey: 'activity_adhd_tips',
      placeholder: 'Add ADHD-friendly tip...',
      color: 'purple'
    }
  ];

  const updateWeekActivity = async (updateData: Partial<WeekActivityUpdate>) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updatedActivity = await WeekActivitiesService.updateWeekActivityApiV1WeekActivitiesWeekActivityIdPut({
        weekActivityId: weekActivity.id,
        requestBody: {
          ...updateData,
          // Preserve existing values
          completed: weekActivity.completed,
          rating: weekActivity.rating,
          notes: weekActivity.notes,
          llm_notes: weekActivity.llm_notes,
        }
      });
      onUpdate(updatedActivity);
    } catch (error) {
      console.error('Error updating week activity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleItemDone = (section: ChecklistSection, item: string) => {
    if (readOnly) return;
    
    const currentDone = section.doneItems;
    const isCurrentlyDone = currentDone.includes(item);
    
    const newDone = isCurrentlyDone 
      ? currentDone.filter(doneItem => doneItem !== item)
      : [...currentDone, item];
    
    updateWeekActivity({
      [section.doneKey]: newDone
    });
  };

  const addItem = (section: ChecklistSection) => {
    const newItem = newItems[section.itemsKey as string]?.trim();
    if (!newItem || readOnly) return;
    
    const currentItems = section.items;
    if (currentItems.includes(newItem)) return; // Prevent duplicates
    
    const updatedItems = [...currentItems, newItem];
    
    updateWeekActivity({
      [section.itemsKey]: updatedItems
    });
    
    setNewItems(prev => ({ ...prev, [section.itemsKey]: '' }));
  };

  const removeItem = (section: ChecklistSection, item: string) => {
    if (readOnly) return;
    
    const updatedItems = section.items.filter(i => i !== item);
    const updatedDone = section.doneItems.filter(i => i !== item);
    
    updateWeekActivity({
      [section.itemsKey]: updatedItems,
      [section.doneKey]: updatedDone
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, section: ChecklistSection) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(section);
    }
  };

  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-50`,
    border: `border-${color}-200`,
    text: `text-${color}-700`,
    button: `bg-${color}-500 hover:bg-${color}-600`,
    iconBg: `bg-${color}-100`,
    iconText: `text-${color}-600`
  });

  if (sections.every(section => section.items.length === 0)) {
    return null; // Don't render if no items in any section
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        if (section.items.length === 0) return null;
        
        const colors = getColorClasses(section.color);
        const Icon = section.icon;
        const completedCount = section.doneItems.length;
        const totalCount = section.items.length;
        const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        
        return (
          <div key={section.title} className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`rounded-full ${colors.iconBg} p-2`}>
                  <Icon className={`h-4 w-4 ${colors.iconText}`} />
                </div>
                <h4 className={`font-medium ${colors.text}`}>{section.title}</h4>
                <span className="text-sm text-gray-500">
                  {completedCount}/{totalCount}
                </span>
              </div>
              {completionPercentage > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-16 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${colors.button.replace('hover:', '')}`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {section.items.map((item, index) => {
                const isDone = section.doneItems.includes(item);
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all ${
                      isDone ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItemDone(section, item)}
                        disabled={readOnly || isUpdating}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        {isDone ? (
                          <CheckSquare className={`h-5 w-5 ${colors.text}`} />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          isDone ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => removeItem(section, item)}
                        disabled={isUpdating}
                        className="text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {!readOnly && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={section.placeholder}
                    value={newItems[section.itemsKey as string] || ''}
                    onChange={(e) =>
                      setNewItems(prev => ({
                        ...prev,
                        [section.itemsKey]: e.target.value
                      }))
                    }
                    onKeyPress={(e) => handleKeyPress(e, section)}
                    disabled={isUpdating}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => addItem(section)}
                    disabled={!newItems[section.itemsKey as string]?.trim() || isUpdating}
                    className={`rounded-md ${colors.button} px-3 py-2 text-white transition-colors disabled:opacity-50`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}