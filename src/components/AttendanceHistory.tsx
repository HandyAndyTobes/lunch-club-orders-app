
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const AttendanceHistory = () => {
  const [attendance] = useLocalStorage<any[]>("attendance", []);

  if (attendance.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No attendance data available.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance History</h2>
      </div>

      {attendance
        .sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime())
        .map((record) => (
          <Card key={record.id} className="p-4 border-green-100 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Week of {new Date(record.week).toLocaleDateString()}
                </h3>
                <p className="text-sm text-gray-500">
                  {record.uniqueCustomers} unique customers, {record.totalAttendees} total orders
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-800">
                £{record.totalRevenue.toFixed(2)} revenue
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
              {record.attendees.map((attendee: any, index: number) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{attendee.name}</div>
                  <div className="text-gray-600">
                    {attendee.orders.length} orders • £{attendee.totalSpent.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default AttendanceHistory;
