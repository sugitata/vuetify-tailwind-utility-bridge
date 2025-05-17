export default function (addUtilities: any) {
  const colors = {
    primary: '#009688',
    secondary: '#BDBDBD',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    success: '#4CAF50',
  };

  const utilities: Record<string, any> = {};

  Object.entries(colors).forEach(([key, color]) => {
    utilities[`.text-${key}`] = { color };
    utilities[`.bg-${key}`] = { backgroundColor: color };
    utilities[`.border-${key}`] = { borderColor: color };
  });

  addUtilities(utilities);
}
