export default async function handler(req, res) {
  try {
    await res.revalidate(`/editions/${req.query.id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log({ err });
    return res.status(400).send('Error revalidating');
  }
}
