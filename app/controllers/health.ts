import system from "systeminformation";
import { Request, Response } from "express";
import mongoose from "mongoose";

export default async (req: Request, res: Response): Promise<void> => {
  // No params/body

  // Returns general wallet / connection / system status info.
  let diskSpaceRemaining;

  try {
    diskSpaceRemaining = await system.fsSize();
    diskSpaceRemaining = Number(
      (
        (diskSpaceRemaining[0].size - diskSpaceRemaining[0].used) /
        (1024 * 1024)
      ).toFixed(2)
    );
  } catch (err) {
    console.log(err);
    diskSpaceRemaining = "error";
  }

  res.send({
    connection: {
      db: mongoose.connection.readyState
    },
    diskSpaceRemaining
  });
  return;
};
