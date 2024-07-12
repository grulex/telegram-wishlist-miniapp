export async function handleError({ error })  {
    const message = error.message.replace(/\n/g, ' ');
    console.error(`Error occurred: ${message}`);
}
