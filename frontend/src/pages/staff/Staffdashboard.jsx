import { useEffect, useState } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/staff/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboard(res.data);
    };

    fetchDashboard();
  }, []);

  if (!dashboard) return <p>Loading...</p>;

  return (
    <>
      <h2>Welcome back, {dashboard.staffName}</h2>

      <p>
        Shift: {dashboard.shift?.startTime} - {dashboard.shift?.endTime}
      </p>

      <p>Clients Assigned: {dashboard.clientCount}</p>
    </>
  );
};

export default StaffDashboard;
