export function extractValueAndUnit(input) {
    const value = parseInt(input.match(/\d+/)[0], 10);
    const unit = input.match(/[a-zA-Z]+/)[0];
    return { value, unit };
}
