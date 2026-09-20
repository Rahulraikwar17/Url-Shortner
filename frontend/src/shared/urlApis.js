import api from "../config/api";

export const getUrls = async () => {
  const response = await api.get("/");

  return response.data;
};

export const generateUrl = async ({ url }) => {
  const response = await api.post("/", {
    url,
  });

  return response.data;
};

export const deleteUrl = async (id) => {
  const response = await api.delete(`/${id}`);

  return response.data;
};
