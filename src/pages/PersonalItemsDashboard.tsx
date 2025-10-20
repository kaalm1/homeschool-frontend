import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  CheckSquare,
  ShoppingCart,
  Calendar,
  X,
  Loader2,
  Trash2,
  Edit2,
  Check,
  Plus,
  Filter,
} from 'lucide-react';
import {
  ItemsService,
  type ProcessedItemsResponse,
  type TodoResponse,
  type ShoppingResponse,
  type CalendarResponse,
} from '@/generated-api';
import QuickAddWidget from '@/components/PersonalItemsDashboard/QuickAddWidget';

type AddMode = 'ai' | 'todo' | 'shopping' | 'calendar' | null;
type ViewTab = 'todos' | 'shopping' | 'calendar';

export default function PersonalItemsDashboard() {
  const [activeTab, setActiveTab] = useState<ViewTab>('todos');
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [mode, setMode] = useState<AddMode>(null);

  // Data states
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [shopping, setShopping] = useState<ShoppingResponse[]>([]);
  const [calendar, setCalendar] = useState<CalendarResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quick Add states
  const [freeformText, setFreeformText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedItems, setProcessedItems] = useState<ProcessedItemsResponse | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Manual form states
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoPriority, setTodoPriority] = useState<string>('medium');
  const [shoppingItem, setShoppingItem] = useState<string>('');
  const [shoppingCategory, setShoppingCategory] = useState<string>('groceries');
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [todosData, shoppingData, calendarData] = await Promise.all([
        ItemsService.getTodosApiV1ItemsTodosGet({ statusFilter: null, priority: null }),
        ItemsService.getShoppingApiV1ItemsShoppingGet({ statusFilter: null, category: null }),
        ItemsService.getCalendarEventsApiV1ItemsCalendarGet({ upcomingOnly: true }),
      ]);
      setTodos(todosData);
      setShopping(shoppingData);
      setCalendar(calendarData);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIProcess = async (): Promise<void> => {
    if (!freeformText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await ItemsService.processUserInputApiV1ItemsProcessPost({
        requestBody: { text: freeformText },
      });
      setProcessedItems(result);
      setShowResults(true);
      await fetchAllItems(); // Refresh all items
    } catch (error) {
      console.error('Error processing input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAdd = (): void => {
    // Implementation for manual add would go here
    console.log('Manual add:', { mode, todoTitle, shoppingItem, eventTitle });
    resetQuickAddForm();
    fetchAllItems();
  };

  const resetQuickAddForm = (): void => {
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

  const closeQuickAdd = (): void => {
    setShowQuickAdd(false);
    resetQuickAddForm();
  };

  const toggleTodoComplete = async (todoId: number): Promise<void> => {
    try {
      await ItemsService.markTodoCompleteApiV1ItemsTodosTodoIdCompletePatch({ todoId });
      await fetchAllItems();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (todoId: number): Promise<void> => {
    try {
      await ItemsService.deleteTodoApiV1ItemsTodosTodoIdDelete({ todoId });
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const markShoppingPurchased = async (shoppingId: number): Promise<void> => {
    try {
      await ItemsService.markShoppingPurchasedApiV1ItemsShoppingShoppingIdPurchasePatch({
        shoppingId,
        actualPrice: null,
      });
      await fetchAllItems();
    } catch (error) {
      console.error('Error marking shopping:', error);
    }
  };

  const deleteShopping = async (shoppingId: number): Promise<void> => {
    try {
      await ItemsService.deleteShoppingApiV1ItemsShoppingShoppingIdDelete({ shoppingId });
      setShopping(shopping.filter((s) => s.id !== shoppingId));
    } catch (error) {
      console.error('Error deleting shopping:', error);
    }
  };

  const deleteCalendar = async (eventId: number): Promise<void> => {
    try {
      await ItemsService.deleteCalendarApiV1ItemsCalendarEventIdDelete({ eventId });
      setCalendar(calendar.filter((c) => c.id !== eventId));
    } catch (error) {
      console.error('Error deleting calendar:', error);
    }
  };

  const activeTodos = todos.filter((t) => t.status !== 'completed');
  const activeShopping = shopping.filter((s) => s.status !== 'pending');
  const upcomingEvents = calendar.filter((c) => c.status !== 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/parent"
              className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
              title="Back to Family Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your tasks, shopping, and events</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/activities"
              className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
            >
              Browse Activities
            </Link>
            <Link
              to="/settings"
              className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Todos</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{activeTodos.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-l-4 border-green-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shopping Items</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{activeShopping.length}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-l-4 border-orange-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('todos')}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'todos'
                  ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              Todos
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'shopping'
                  ? 'border-b-2 border-green-500 bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Shopping
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'calendar'
                  ? 'border-b-2 border-orange-500 bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Calendar
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {/* Todos Tab */}
                {activeTab === 'todos' && (
                  <div className="space-y-3">
                    {activeTodos.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        <CheckSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                        <p className="font-medium">No active todos</p>
                        <p className="mt-1 text-sm">Add your first task to get started!</p>
                      </div>
                    ) : (
                      activeTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <button
                              onClick={() => toggleTodoComplete(todo.id)}
                              className="rounded-lg border-2 border-gray-300 p-1 transition hover:border-blue-500 hover:bg-blue-50"
                            >
                              <Check className="h-4 w-4 text-transparent group-hover:text-blue-500" />
                            </button>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{todo.title}</h4>
                              {todo.description && (
                                <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
                              )}
                              <div className="mt-2 flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    todo.priority === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : todo.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {todo.priority}
                                </span>
                                {todo.due_date && (
                                  <span className="text-xs text-gray-500">
                                    Due: {new Date(todo.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Shopping Tab */}
                {activeTab === 'shopping' && (
                  <div className="space-y-3">
                    {activeShopping.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                        <p className="font-medium">No shopping items</p>
                        <p className="mt-1 text-sm">Add items to your shopping list!</p>
                      </div>
                    ) : (
                      activeShopping.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-green-300 hover:shadow-md"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <button
                              onClick={() => markShoppingPurchased(item.id)}
                              className="rounded-lg border-2 border-gray-300 p-1 transition hover:border-green-500 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4 text-transparent group-hover:text-green-500" />
                            </button>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                  {item.category}
                                </span>
                                {item.estimated_price && (
                                  <span className="text-xs text-gray-500">
                                    ~${item.estimated_price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => deleteShopping(item.id)}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Calendar Tab */}
                {activeTab === 'calendar' && (
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                        <p className="font-medium">No upcoming events</p>
                        <p className="mt-1 text-sm">Schedule your first event!</p>
                      </div>
                    ) : (
                      upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-orange-300 hover:shadow-md"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-3 text-center">
                              <div className="text-xs font-semibold text-orange-600">
                                {new Date(event.start_time).toLocaleDateString('en-US', {
                                  month: 'short',
                                })}
                              </div>
                              <div className="text-lg font-bold text-orange-900">
                                {new Date(event.start_time).getDate()}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              {event.location && (
                                <p className="mt-1 text-sm text-gray-600">📍 {event.location}</p>
                              )}
                              {event.start_time && (
                                <p className="mt-1 text-sm text-gray-500">🕐 {event.start_time}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => deleteCalendar(event.id)}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Add</h3>
              <button
                onClick={closeQuickAdd}
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
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
                  <h4 className="font-semibold text-gray-900">Items Created Successfully!</h4>
                  <button
                    onClick={() => {
                      resetQuickAddForm();
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Add More
                  </button>
                </div>

                {processedItems.todos && processedItems.todos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                      Todos ({processedItems.todos.length})
                    </div>
                    {processedItems.todos.map((todo, idx: number) => (
                      <div key={idx} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                        <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                        <div className="mt-1 text-xs text-gray-600">Priority: {todo.priority}</div>
                      </div>
                    ))}
                  </div>
                )}

                {processedItems.shopping && processedItems.shopping.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      Shopping ({processedItems.shopping.length})
                    </div>
                    {processedItems.shopping.map((item, idx: number) => (
                      <div key={idx} className="rounded-lg border border-green-100 bg-green-50 p-3">
                        <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                        <div className="mt-1 text-xs text-gray-600">Category: {item.category}</div>
                      </div>
                    ))}
                  </div>
                )}

                {processedItems.calendar && processedItems.calendar.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      Events ({processedItems.calendar.length})
                    </div>
                    {processedItems.calendar.map((event, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-orange-100 bg-orange-50 p-3"
                      >
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="mt-1 text-xs text-gray-600">{event.start_time}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={closeQuickAdd}
                  className="w-full rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <QuickAddWidget />
    </div>
  );
}
