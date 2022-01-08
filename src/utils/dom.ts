const BODY = 'body';

export const getElement = (selector: any) => document.querySelector(selector);
export const getBody = () => getElement(BODY);
export const hasClass = (element: any, className: string) => element.classList.contains(className);
export const hasClassOfBody = (className: string) => hasClass(getBody(), className);
