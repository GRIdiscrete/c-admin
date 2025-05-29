"use client"
import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format as dateFnsFormat, parse as dateFnsParse, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Order } from "@/types-db";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X, Package, MapPin, Store, Clock, DollarSign, List, Info, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatter } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format: dateFnsFormat,
  parse: dateFnsParse,
  startOfWeek,
  getDay,
  locales,
});

interface DeliveryCalendarProps {
  orders: Order[];
}

const DeliveryCalendar = ({ orders }: DeliveryCalendarProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Calculate filtered orders based on current view and date
  const { filteredOrders, totalAmount, orderCount } = useMemo(() => {
    const filtered = orders.filter(order => {
      if (!order.deliveryDate) return false;
      const deliveryDate = new Date(order.deliveryDate);
      
      switch (view) {
        case Views.DAY:
          return isSameDay(deliveryDate, date);
        case Views.WEEK:
          return isSameWeek(deliveryDate, date);
        case Views.MONTH:
          return isSameMonth(deliveryDate, date);
        default:
          return true;
      }
    });

    const amount = filtered.reduce((sum, order) => {
      return sum + (order.orderItems?.reduce((orderSum, item) => {
        return orderSum + (item.price * (item.qty || 1));
      }, 0) || 0);
    }, 0);

    return {
      filteredOrders: filtered,
      totalAmount: amount,
      orderCount: filtered.length
    };
  }, [orders, view, date]);

  useEffect(() => {
    const formattedEvents = filteredOrders
      .map(order => {
        const deliveryDate = new Date(order.deliveryDate!);
        return {
          id: order.id,
          title: `${order.clientName} - ${order.store_name}`,
          start: deliveryDate,
          end: new Date(deliveryDate.getTime() + 60 * 60 * 1000),
          allDay: false,
          order: order,
        };
      });
    setEvents(formattedEvents);
  }, [filteredOrders]);

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#6366f1";
    let borderColor = "#4f46e5";

    if (event.order.order_status === "Pending") {
      backgroundColor = "#818cf8";
    } else if (event.order.order_status === "Processing") {
      backgroundColor = "#4338ca";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "0.5rem",
        opacity: 0.8,
        color: "white",
        border: "1px solid",
        display: "block",
      },
    };
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <div className="h-[800px] w-full p-14">
      {/* Order Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
  <DialogContent className="max-w-2xl p-0 overflow-hidden">
    <DialogHeader className="border-b px-6 py-4">
      <DialogTitle className="flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-800">Order Details</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSelectedEvent(null)}
          className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >

        </Button>
      </DialogTitle>
    </DialogHeader>
    
    {selectedEvent && (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{selectedEvent.order.clientName}</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Store:</span> {selectedEvent.order.store_name}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedEvent.order.order_status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : selectedEvent.order.order_status === 'cancelled' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-indigo-100 text-indigo-800'
          }`}>
            {selectedEvent.order.order_status.charAt(0).toUpperCase() + selectedEvent.order.order_status.slice(1)}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Delivery Time</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {dateFnsFormat(selectedEvent.start, "EEEE, MMMM d, yyyy")}
                  <br />
                  {dateFnsFormat(selectedEvent.start, "h:mm a")} - {dateFnsFormat(selectedEvent.end, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="bg-indigo-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Delivery Address</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.order.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Store className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Store Address</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.order.store_address}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-700">Order Summary</h3>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {selectedEvent.order.orderItems?.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center pb-3 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.qty || 1} × {formatter.format(item.price)}
                      {item.variation && ` (${item.variation})`}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {formatter.format(item.price * (item.qty || 1))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-medium text-gray-800">
                <span>Subtotal</span>
                <span>{formatter.format(
                  selectedEvent.order.orderItems?.reduce((total: number, item: any) => {
                    return total + (item.price * (item.qty || 1));
                  }, 0) || 0
                )}</span>
              </div>
              {selectedEvent.order.deliveryFee && (
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Delivery Fee</span>
                  <span>{formatter.format(selectedEvent.order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg mt-3 pt-2 border-t">
                <span>Total</span>
                <span>{formatter.format(
                  (selectedEvent.order.orderItems?.reduce((total: number, item: any) => {
                    return total + (item.price * (item.qty || 1));
                  }, 0) || 0) + (selectedEvent.order.deliveryFee || 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Notes */}
        {selectedEvent.order.deliveryInstructions && (
          <div className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-200 p-2 rounded-full">
                <Info className="h-5 w-5 text-indigo-700" />
              </div>
              <h3 className="font-medium text-gray-700">Delivery Notes</h3>
            </div>
            <p className="text-sm text-gray-600 pl-11">{selectedEvent.order.deliveryInstructions}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setSelectedEvent(null)}
            className="hover:bg-gray-100"
          >
            Close
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Truck className="h-4 w-4 mr-2" />
            Track Delivery
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog> 
      {/* Calendar Content */}
      <div className="mb-4 flex flex-col space-y-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800">Current Period</h3>
            <p className="text-2xl font-bold text-indigo-900">
              {view === Views.DAY 
                ? dateFnsFormat(date, "MMMM d, yyyy") 
                : view === Views.WEEK 
                  ? `Week of ${dateFnsFormat(date, "MMMM d")}`
                  : dateFnsFormat(date, "MMMM yyyy")}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800">Total Orders</h3>
            <p className="text-2xl font-bold text-indigo-900">{orderCount}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800">Total Amount</h3>
            <p className="text-2xl font-bold text-indigo-900">{formatter.format(totalAmount)}</p>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-800">Delivery Schedule</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={view === Views.MONTH ? "default" : "outline"}
              onClick={() => setView(Views.MONTH)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Month
            </Button>
            <Button
              variant={view === Views.WEEK ? "default" : "outline"}
              onClick={() => setView(Views.WEEK)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Week
            </Button>
            <Button
              variant={view === Views.DAY ? "default" : "outline"}
              onClick={() => setView(Views.DAY)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Day
            </Button>
            <Button
              variant={view === Views.AGENDA ? "default" : "outline"}
              onClick={() => setView(Views.AGENDA)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Agenda
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? dateFnsFormat(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate: Date | undefined) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                      setView(Views.DAY);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        eventPropGetter={eventStyleGetter}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        components={{
          event: ({ event }) => <EventComponent event={event} onClick={() => handleEventClick(event)} />,
        }}
        className="bg-white rounded-lg shadow-lg border border-indigo-100"
      />
    </div>
  );
};

const EventComponent = ({ event, onClick }: { event: any, onClick: () => void }) => {
  const orderTotal = event.order.orderItems?.reduce((sum: number, item: any) => {
    return sum + (item.price * (item.qty || 1));
  }, 0) || 0;

  return (
    <div 
      onClick={onClick}
      className="p-2 space-y-1 cursor-pointer hover:bg-indigo-50/50 transition-colors rounded"
    >
      <div className="font-semibold text-sm truncate">
        {event.order.clientName}
      </div>
      <div className="text-xs">
        {dateFnsFormat(event.start, "h:mm a")} • {formatter.format(orderTotal)}
      </div>
    </div>
  );
};

export default DeliveryCalendar;