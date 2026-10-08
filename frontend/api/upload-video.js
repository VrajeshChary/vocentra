export default function handler(req, res) {
  const jobId = "job_demo_" + Math.random().toString(36).substring(2, 9);
  res.status(200).json({
    job_id: jobId,
    status: "processing",
    message: "Analysis job accepted for processing."
  });
}
