import httpClient from "../lib/httpClient";

export const fetchFirmOptions = async (
  search = '',
  limit = 20
) => {
  const res = await httpClient.get('/api/firms/options', {
    params: { search, limit },
  });
  return res.data;
};

export const createFirmEmployee = async (formData, firmId) => {
  const res = await httpClient.post("/api/firm_employee", {
    ...formData,
    firmId,
  });

  return res.data;
};

export const updateFirmEmployee = async (
  employeeId,
  formData,
  firmId
) => {
  const res = await httpClient.put(
    `/api/firm_employee/${employeeId}`,
    {
      ...formData,
      firmId,
    }
  );

  return res.data;
};



// export const saveFirmEmployee = async ({
//   formData,
//   firmId,
//   employeeId = null,
// }) => {
//   const isUpdating = Boolean(employeeId);

//   const url = isUpdating
//     ? `/api/firm_employee/${employeeId}`
//     : `/api/firm_employee`;

//   const method = isUpdating ? "put" : "post";

//   const res = await httpClient[method](url, {
//     ...formData,
//     firmId,
//   });

//   return res.data; // return backend response
// };
