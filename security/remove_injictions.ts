export function sanitizeInput(input: string): string {
    if (!input) return '';

    // Normalize input to prevent encoding tricks
    let sanitized = input.normalize('NFKC');

    // Remove SQL injection patterns
    sanitized = sanitized.replace(/(['"\\;])/g, '');

    // Remove XSS injection patterns
    sanitized = sanitized.replace(/<.*?>/g, '');
    sanitized = sanitized.replace(/(javascript:|data:|vbscript:)/gi, '');

    // Remove event handlers and other potentially harmful attributes
    sanitized = sanitized.replace(/on\w+\s*=\s*(['"].*?['"]|[^ >]+)/gi, '');

    // Remove CSS expressions
    sanitized = sanitized.replace(/expression\s*\(/gi, '');

    // Remove any remaining suspicious patterns
    sanitized = sanitized.replace(/(script|iframe|object|embed|applet|link|style|form|meta|img|svg)/gi, '');
    sanitized = sanitized.replace(",","")

    return sanitized.trim();
}