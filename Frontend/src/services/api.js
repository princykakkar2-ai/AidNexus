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
// 

// Get details of a particular student solution
export const fetchExpertSolutions = async () => {
  const response = await axios.get(`${API_BASE_URL}/expert/solutions`);

  return response.data;
};
export const fetchSolutionDetails = async (solutionId) => {
  const response = await axios.get(
    `${API_BASE_URL}/expert/solutions/${solutionId}`,
  );

  return response.data;
};

// Get existing reviews for a solution
export const fetchFeedback = async (solutionId) => {
  const response = await axios.get(
    `${API_BASE_URL}/expert/solutions/${solutionId}/reviews`,
  );

  return response.data;
};

// Submit expert review
export const submitFeedback = async (solutionId, feedbackData) => {
  const response = await axios.post(
    `${API_BASE_URL}/expert/solutions/${solutionId}/reviews`,
    feedbackData,
    {
      headers: {
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

  Object.entries(problemData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (file) {
    formData.append("image", file);
  }

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
