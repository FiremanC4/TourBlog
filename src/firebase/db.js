import { auth } from "./firebase";
import { API_CONFIG } from "../config/api";

export const addUser = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: await auth.currentUser?.getIdToken(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImage = async (file) => {
  try {
    const base64String = await fileToBase64(file);

    const response = await fetch(`${API_CONFIG.BASE_URL}/images/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({
        imageData: base64String,
        size: file.size,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.imageId;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getImage = async (imageId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Image not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting image:", error);
    throw error;
  }
};

export const getImages = async (imageIds) => {
  try {
    const imagePromises = imageIds.map((id) => getImage(id));
    return await Promise.all(imagePromises);
  } catch (error) {
    console.error("Error getting images:", error);
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be logged in to create an article");
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await currentUser.getIdToken()}`,
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error("Failed to create article");
    }

    const data = await response.json();
    return data.articleId;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

export const getArticles = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/articles`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting articles:", error);
    throw error;
  }
};

export const getArticlesByAuthor = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/articles/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user's articles");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user's articles:", error);
    throw error;
  }
};

export const getArticle = async (articleId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      throw new Error("Failed to fetch article");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting article:", error);
    throw error;
  }
};

export async function deleteArticle(articleId) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      if (response.status === 403) {
        throw new Error("You can only delete your own articles");
      }
      throw new Error("Failed to delete article");
    }

    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export const deleteImage = async (imageId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/images/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Image not found");
      }
      throw new Error("Failed to delete image");
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export async function updateArticle(articleId, articleData) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          title: articleData.title,
          text: articleData.text,
          imageRefs: articleData.imageRefs,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      if (response.status === 403) {
        throw new Error("You can only update your own articles");
      }
      throw new Error("Failed to update article");
    }

    return true;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export const addComment = async (articleId, text) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      throw new Error("Failed to add comment");
    }

    const data = await response.json();
    return data.commentId;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (articleId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}/comments`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      throw new Error("Failed to fetch comments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
};

export const listenToComments = (articleId, callback) => {
  const ws = new WebSocket(
    `${API_CONFIG.BASE_URL.replace(
      "http",
      "ws"
    )}/articles/${articleId}/comments/ws`
  );

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WebSocket error:", data.error);
        return;
      }
      callback(data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Return cleanup function
  return () => {
    ws.close();
  };
};

export const toggleLike = async (articleId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/articles/${articleId}/likes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article not found");
      }
      throw new Error("Failed to toggle like");
    }

    const data = await response.json();
    return data.likesCount;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// WebSocket connection cache
const wsConnections = new Map();

export const listenToLikes = (articleId, callback) => {
  const getToken = async () => {
    try {
      return await auth.currentUser?.getIdToken();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const connect = async () => {
    // Check if we already have a connection for this article
    if (wsConnections.has(articleId)) {
      const existingConnection = wsConnections.get(articleId);
      existingConnection.callbacks.add(callback);
      return () => {
        existingConnection.callbacks.delete(callback);
        if (existingConnection.callbacks.size === 0) {
          existingConnection.ws.close();
          wsConnections.delete(articleId);
        }
      };
    }

    const token = await getToken();
    const ws = new WebSocket(
      `${API_CONFIG.BASE_URL.replace(
        "http",
        "ws"
      )}/articles/${articleId}/likes/ws?token=${token || ""}`
    );

    const callbacks = new Set([callback]);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error("WebSocket error:", data.error);
          return;
        }
        // Notify all callbacks
        callbacks.forEach((cb) => cb(data));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      wsConnections.delete(articleId);
      // Try to reconnect after a delay
      setTimeout(() => {
        if (callbacks.size > 0) {
          connect();
        }
      }, 5000);
    };

    // Store the connection
    wsConnections.set(articleId, { ws, callbacks });

    // Return cleanup function
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        ws.close();
        wsConnections.delete(articleId);
      }
    };
  };

  return connect();
};
