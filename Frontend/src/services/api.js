import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Get authentication token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// ==========================================
// EXPERT / INDUSTRY MODULE APIs
// ==========================================

// Get all solutions available for expert review
export const fetchExpertSolutions = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/feedback/expert/solutions`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Get details of a particular student solution
export const fetchSolutionDetails = async (solutionId) => {
  const response = await axios.get(
    `${API_BASE_URL}/feedback/solution/${solutionId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Get existing feedback for a solution
export const fetchFeedback = async (solutionId) => {
  const response = await axios.get(
    `${API_BASE_URL}/feedback/solution/${solutionId}/feedback`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Submit expert feedback
export const submitFeedback = async (solutionId, feedbackData) => {
  const response = await axios.post(
    `${API_BASE_URL}/feedback/solution/${solutionId}`,
    feedbackData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// ==========================================
// MEMBER 2 — PROBLEM MODULE APIs
// ==========================================

export const createProblem = async (problemData, file) => {
  const formData = new FormData();
  Object.entries(problemData).forEach(([key, value]) => formData.append(key, value));
  if (file) formData.append("image", file);

  const response = await axios.post(`${API_BASE_URL}/problems`, formData, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
};

export const fetchProblems = async () => {
  const response = await axios.get(`${API_BASE_URL}/problems`);
  return response.data.data;
};

export const fetchProblem = async (problemId) => {
  const response = await axios.get(`${API_BASE_URL}/problems/${problemId}`);
  return response.data.data;
};

export const deleteProblem = async (problemId) => {
  const response = await axios.delete(`${API_BASE_URL}/problems/${problemId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
