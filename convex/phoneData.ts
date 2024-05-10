import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addPhoneData = mutation({
  args: {
    device: v.string(),
    gyroscopeX: v.optional(v.number()),
    gyroscopeY: v.optional(v.number()),
    gyroscopeZ: v.optional(v.number()),
    pressure: v.optional(v.number()),
    altitude:v.optional(v.number()),
    orientation: v.optional(v.number()),
    magnetometerX: v.optional(v.number()),
    magnetometerY: v.optional(v.number()),
    magnetometerZ: v.optional(v.number()),
    steps: v.optional(v.number()),
    accelerometerX: v.optional(v.number()),
    accelerometerY: v.optional(v.number()),
    accelerometerZ: v.optional(v.number()),
    lightIntensity: v.optional(v.number()),  // Optional for compatibility with Android
  },
  handler: async (ctx, args) => {
    const existingEntry = await ctx.db.query("phoneData").filter(q => q.eq(q.field("device"), args.device)).first();

    if (existingEntry) {
      return await ctx.db.patch(existingEntry._id, {
          gyroscopeX: args.gyroscopeX,
          gyroscopeY: args.gyroscopeY,
          gyroscopeZ: args.gyroscopeZ,
          pressure: args.pressure,
          altitude: args.altitude,
          orientation: args.orientation,
          magnetometerX: args.magnetometerX,
          magnetometerY: args.magnetometerY,
          magnetometerZ: args.magnetometerZ,
          steps: args.steps,
          accelerometerX: args.accelerometerX,
          accelerometerY: args.accelerometerY,
          accelerometerZ: args.accelerometerZ,
          lightIntensity: args.lightIntensity  // Handle the case where lightIntensity might not be provided
      });
    } else {
      return await ctx.db.insert("phoneData", {
        device: args.device,
        gyroscopeX: args.gyroscopeX,
        gyroscopeY: args.gyroscopeY,
        gyroscopeZ: args.gyroscopeZ,
        pressure: args.pressure,
        altitude: args.altitude,
        orientation: args.orientation,
        magnetometerX: args.magnetometerX,
        magnetometerY: args.magnetometerY,
        magnetometerZ: args.magnetometerZ,
        steps: args.steps,
        accelerometerX: args.accelerometerX,
        accelerometerY: args.accelerometerY,
        accelerometerZ: args.accelerometerZ,
        lightIntensity: args.lightIntensity
      });
    }
  }
});


export const getPhoneData = query({
  args:{
    deviceId: v.string()
  },
  handler: async (ctx, args) => {
    const device = await ctx.db.query("phoneData").filter(q => q.eq(q.field("device"),args.deviceId)).unique()

    if(!device){
      throw Error("no se encuentra ese telefono")
    }

    return device
  }
})
