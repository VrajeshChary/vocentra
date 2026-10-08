export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({
    job_id: id || "job_demo",
    status: "completed",
    progress: 100,
    error: null
  });
}
