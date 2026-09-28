import { API, authHeaders } from "./apiClient";

export async function uploadRepo(file) {
  const form = new FormData();
  form.append("file", file);

  console.log("API:", API);
  console.log("Headers:", authHeaders());
  console.log(API);
  console.log("Before fetch");

  try {
      const res = await fetch(`${API}/workspace/upload`, {
          method: "POST",
          headers: authHeaders(),
          body: form,
      });

      console.log("After fetch", res.status);

      const data = await res.json();
      console.log(data);

      return data;
  } catch (err) {
      console.error("FETCH ERROR:", err);
      throw err;
  }
}