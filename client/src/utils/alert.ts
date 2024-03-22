/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector('.murkup') as HTMLElement;
  const parentElement = el.parentElement!;
  if (el) parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type: string, msg: string) => {
  const alert = `fixed top-0 left-1/2 transform -translate-x-1/2 z-50 text-white text-lg font-normal text-center rounded-b-lg p-5 shadow-lg bg-gray-900
`;
  const bgColor = `${type === 'success' ? 'bg-green-500' : 'bg-red-600'}`;
  const markup = `<div class="murkup ${alert} ${bgColor}">${msg}</div>`;
  const body = document.querySelector('body')!;
  body.insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
