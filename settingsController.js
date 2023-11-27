import { updateObj } from "./core.js";

export const settings = document.getElementById("settings");

export function openSettings(object) {
  settings.innerHTML = "";
  object.getSettings().forEach((property) => {
    createSettingsElements(object, property.split('.'), "number");
  });
}

export function createSettingsElements(obj, properties, type) {
  const label = document.createElement("label");
  label.textContent = properties.join('.');

  if (properties.length === 1) {
    const input = document.createElement("input");
    input.type = type;
    input.value = obj[properties[0]];
    input.addEventListener("input", (event) => {
      obj.clear();
      obj[properties[0]] = type === "number" ? Number(event.target.value) : event.target.value;
      updateObj();
    });

    settings.appendChild(label);
    settings.appendChild(input);
  } else if (properties.length === 2 && properties[1] === 'p1') {
    const xInput = document.createElement("input");
    const yInput = document.createElement("input");

    xInput.type = yInput.type = type;
    xInput.value = obj[properties[0]][properties[1]].x;
    yInput.value = obj[properties[0]][properties[1]].y;

    xInput.addEventListener("input", updateValues);
    yInput.addEventListener("input", updateValues);

    settings.appendChild(label);
    settings.appendChild(xInput);
    settings.appendChild(yInput);

    function updateValues(event) {
      obj.clear();
      obj[properties[0]][properties[1]] = {
        x: Number(xInput.value),
        y: Number(yInput.value),
      };
      updateObj();
    }
  }

  // Add additional conditions for other nested properties as needed.
}
