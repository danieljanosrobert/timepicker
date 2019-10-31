export function log(req: any, res: any, next: any) {
  console.log('');
  if (req.body) { console.log(req.body); }
  if (req.params) { console.log(req.params); }
  if (req.query) { console.log(req.query); }
  console.log(`Recived a ${req.method} request from ${req.ip} for ${req.url}`);
  next();
}
