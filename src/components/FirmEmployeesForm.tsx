import { useEffect, useState } from "react";
import { User, AlertCircle, Trash2, Edit } from "lucide-react";
import {
  createFirmEmployee,
  updateFirmEmployee,
} from "../services/firmService";

const seniorityLevels = [
  "Associate",
  "Senior Associate",
  "Principal",
  "Partner",
  "VP",
  "Director",
  "Analyst",
];

const emptyEmployee = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  seniorityLevel: "",
};

// Internal Input Component
function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value || ""} // Ensure value is never undefined/null
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 ring-red-100"
            : "border-gray-300 focus:ring-blue-100"
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function FirmEmployeesForm({
  employees,
  setEmployees,
  firmId,
  firmName,
}) {
  //   const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(emptyEmployee);
  const [errors, setErrors] = useState({});
  // Consolidate editing state into one variable (the index)
  const [editingIndex, setEditingIndex] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.firstName) errs.firstName = "Required";
    if (!formData.lastName) errs.lastName = "Required";
    if (!formData.email) errs.email = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 2. Handle Add or Update
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!firmId) {
      alert("Please select a firm first");
      return;
    }

    try {
      const isUpdating = editingIndex !== null;
      const employeeId = isUpdating ? employees[editingIndex].id : null;

      let result;

      if (isUpdating) {
        result = await updateFirmEmployee(employeeId, formData, firmId);
      } else {
        result = await createFirmEmployee(formData, firmId);
      }

      if (isUpdating) {
        setEmployees((prev) =>
          prev.map((emp, idx) =>
            idx === editingIndex ? { ...formData, id: employeeId } : emp,
          ),
        );
        alert("Employee updated successfully!");
      } else {
        setEmployees((prev) => [...prev, { ...formData, id: result.id }]);
        alert("Employee added successfully!");
      }

      setFormData(emptyEmployee);
      setEditingIndex(null);
      setErrors({});
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.error || "Failed to save employee");
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingIndex(emp.id); // Set the actual database UUID
  };
  const handleDelete = (index) => {
    setEmployees((prev) => prev.filter((_, idx) => idx !== index));
    // If we delete the item we are currently editing, reset the form
    if (editingIndex === index) {
      setFormData(emptyEmployee);
      setEditingIndex(null);
    }
  };

  useEffect(() => {
    // Optional: clear employees when firm changes
    setEmployees([]);
  }, [firmId]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Add / Edit Employee Form */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          {editingIndex !== null ? "Edit Employee" : "Add Employee"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            error={errors.firstName}
            onChange={(v) => setFormData({ ...formData, firstName: v })}
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            error={errors.lastName}
            onChange={(v) => setFormData({ ...formData, lastName: v })}
          />
          <Input
            label="Email Address *"
            value={formData.email}
            error={errors.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })}
          />
          <Input
            label="Job Title *"
            value={formData.jobTitle}
            error={errors.jobTitle}
            onChange={(v) => setFormData({ ...formData, jobTitle: v })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seniority Level
            </label>
            <select
              value={formData.seniorityLevel}
              onChange={(e) =>
                setFormData({ ...formData, seniorityLevel: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select</option>
              {seniorityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {editingIndex !== null ? "Update Employee" : "Add Employee"}
          </button>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setFormData(emptyEmployee);
              }}
              className="text-gray-600 px-4 py-2 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Employees List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">
          Team Members ({employees.length})
        </h4>
        {employees.map((emp, index) => (
          <div
            key={index}
            className={`flex justify-between items-center border p-4 rounded-lg transition-colors ${
              editingIndex === index ? "border-blue-500 bg-blue-50" : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold text-gray-800">
                {emp.firstName} {emp.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {emp.jobTitle} {emp.seniorityLevel && `• ${emp.seniorityLevel}`}{" "}
                • {emp.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit"
              >
                <Edit size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
