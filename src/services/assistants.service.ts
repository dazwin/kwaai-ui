import { PAIOS_API_URL } from "../config/env";
import { Bot, conversation, Message } from "../data/types";

interface CreateAssistantResponse {
  name: string;
  uri: string;
  description: string;
  resource_llm_id: string;
  persona_id: string;
  files: string[];
  status: string;
  allow_edit: string;
  kind: string;
  icon: string;
  id: string;
}

class AssistantsService {
  async createAssistant(
    name: string,
    description: string,
    kind: string,
    { uri, resource_llm_id, persona_id, files, status, allow_edit, icon }: 
    { 
      uri: string, 
      resource_llm_id: string, 
      persona_id: string, 
      files: string[], 
      status: string, 
      allow_edit: string, 
      icon: string 
    }
  ): Promise<CreateAssistantResponse> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          description: description,
          kind: kind,
          uri: uri,
          resource_llm_id: resource_llm_id,
          persona_id: persona_id,
          files: files,
          status: status,
          allow_edit: allow_edit,
          icon: icon
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating assistant:", error);
      throw error;
    }
  }

  async updateAssistant(assistantId: string, assistantData: Bot): Promise<CreateAssistantResponse> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources/${assistantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteAssistant(id: string): Promise<void> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting assistant:", error);
      throw error;
    }
  }

  async uploadFiles(assistantId: string, files: File[]): Promise<void> {
    console.log("You're in the uploadFiles function");
    try {
      const formData = new FormData();
      files.forEach((file) => {
        console.log(file.name);
        formData.append("files", file);
      });

      const response = await fetch(`${PAIOS_API_URL}/upload/${assistantId}/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  static async getAssistants(kind: string): Promise<Bot[]> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources?filter={"kind":"${kind}"}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format");
      }
      return data;
    } catch (error) {
      console.error("Error fetching assistants:", error);
      throw new Error(`Error fetching assistants: ${error}`);
    }
  }

  async createConversation(name:string, assistantId: string): Promise<conversation> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/conversations/${assistantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sendMessage(assistantId:string, conversationId: string, prompt: string): Promise<Message> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistant_id: assistantId,
          conversation_id: conversationId,
          prompt: prompt,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default AssistantsService;