import { LabelCustom } from "@/components/app/label-custom";
import { Button } from "@/components/ui/button";
import { type PluginStandardProps } from "@vert-capital/hub-plugin-style/types";

export default function ButtonCustom({ user, onEvent }: PluginStandardProps) {
  return (
    <div className="hub:p-4 hub:space-y-2">
      <p>{user?.name || "Nome de usuário não fornecido"}</p>
      <Button
        onClick={() => {
          console.log("Button clicked");
          fetch(`${import.meta.env.VITE_URL_API}/posts`, {})
            .then((response) => response.json())
            .then((data) => {
              console.log("Data fetched:", data);
              onEvent?.({
                type: "plugin-event-confirm",
                payload: { data },
                timestamp: new Date().toISOString(),
                context: {
                  pluginId: "ButtonCustom",
                  userId: user?.id,
                },
              });
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }}
      >
        <LabelCustom label="Click me!!" />
      </Button>
    </div>
  );
}
