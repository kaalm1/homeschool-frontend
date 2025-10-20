import { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  ShoppingCart,
  Calendar,
  X,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { ItemsService, type ProcessedItemsResponse } from '@/generated-api';

type AddMode = 'ai' | 'todo' | 'shopping' | 'calendar' | null;

interface ProcessedItems {
  todos?: Array<{ id: number; title: string; priority: string }>;
  shopping?: Array<{ id: number; item: string; category: string }>;
  calendar?: Array<{ id: number; title: string; date: string }>;
}

export default function QuickAddWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<AddMode>(null);
  const [freeformText, setFreeformText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedItems, setProcessedItems] = useState<ProcessedItemsResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Manual form states
  const [todoTitle, setTodoTitle] = useState('');
  const [todoPriority, setTodoPriority] = useState('medium');
  const [shoppingItem, setShoppingItem] = useState('');
  const [shoppingCategory, setShoppingCategory] = useState('groceries');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  const handleAIProcess = async () => {
    if (!freeformText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await ItemsService.processUserInputApiV1ItemsProcessPost({
        requestBody: { text: freeformText },
      });
      setProcessedItems(result);
      setShowResults(true);
    } catch (error) {
      console.error('Error processing input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAdd = () => {
    // Handle manual addition based on mode
    console.log('Manual add:', { mode, todoTitle, shoppingItem, eventTitle });
    resetForm();
  };

  const resetForm = () => {
    setMode(null);
    setFreeformText('');
    setTodoTitle('');
    setShoppingItem('');
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setShowResults(false);
    setProcessedItems(null);
  };

  const closeWidget = () => {
    setIsExpanded(false);
    resetForm();
  };

  if (!isExpanded) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <Sparkles className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">Quick Add</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 w-96">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Add</h3>
          <button
            onClick={closeWidget}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selection */}
        {!mode && !showResults && (
          <div className="space-y-3 p-4">
            <p className="mb-4 text-sm text-gray-600">What would you like to add?</p>

            <button
              onClick={() => setMode('ai')}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-left transition hover:border-purple-300 hover:shadow-md"
            >
              <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">AI Assistant</div>
                <div className="text-xs text-gray-600">Let AI organize your thoughts</div>
              </div>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMode('todo')}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Todo</span>
              </button>

              <button
                onClick={() => setMode('shopping')}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-green-300 hover:bg-green-50"
              >
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Shopping</span>
              </button>

              <button
                onClick={() => setMode('calendar')}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="text-xs font-medium text-gray-700">Event</span>
              </button>
            </div>
          </div>
        )}

        {/* AI Mode */}
        {mode === 'ai' && !showResults && (
          <div className="space-y-4 p-4">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tell me what you need to do
              </label>
              <textarea
                value={freeformText}
                onChange={(e) => setFreeformText(e.target.value)}
                placeholder="E.g., 'Buy milk and eggs tomorrow, schedule dentist appointment for next week, and finish the project report by Friday'"
                className="min-h-[120px] w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              />
            </div>

            <button
              onClick={handleAIProcess}
              disabled={!freeformText.trim() || isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white transition hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Organize with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* Manual Todo Mode */}
        {mode === 'todo' && (
          <div className="space-y-4 p-4">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Todo Title</label>
              <input
                type="text"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={todoPriority}
                onChange={(e) => setTodoPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              onClick={handleManualAdd}
              disabled={!todoTitle.trim()}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Todo
            </button>
          </div>
        )}

        {/* Manual Shopping Mode */}
        {mode === 'shopping' && (
          <div className="space-y-4 p-4">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                value={shoppingItem}
                onChange={(e) => setShoppingItem(e.target.value)}
                placeholder="What do you need to buy?"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={shoppingCategory}
                onChange={(e) => setShoppingCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
              >
                <option value="groceries">Groceries</option>
                <option value="household">Household</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={handleManualAdd}
              disabled={!shoppingItem.trim()}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Shopping List
            </button>
          </div>
        )}

        {/* Manual Calendar Mode */}
        {mode === 'calendar' && (
          <div className="space-y-4 p-4">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="What's the event?"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleManualAdd}
              disabled={!eventTitle.trim() || !eventDate}
              className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Event
            </button>
          </div>
        )}

        {/* Results Display */}
        {showResults && processedItems && (
          <div className="max-h-96 space-y-4 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Created Items</h4>
              <button onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-700">
                Add More
              </button>
            </div>

            {processedItems?.todos?.length ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  Todos ({processedItems.todos.length})
                </div>
                {processedItems.todos.map((todo, idx) => (
                  <div key={idx} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                    <div className="mt-1 text-xs text-gray-600">Priority: {todo.priority}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {processedItems?.shopping?.length ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  Shopping ({processedItems.shopping.length})
                </div>
                {processedItems.shopping.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-green-100 bg-green-50 p-3">
                    <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                    <div className="mt-1 text-xs text-gray-600">Category: {item.category}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {processedItems?.calendar?.length ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  Events ({processedItems.calendar.length})
                </div>
                {processedItems.calendar.map((event, idx) => (
                  <div key={idx} className="rounded-lg border border-orange-100 bg-orange-50 p-3">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="mt-1 text-xs text-gray-600">{event.start_time}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <button
              onClick={closeWidget}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
