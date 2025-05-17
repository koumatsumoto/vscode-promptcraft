// Unit tests for Logger using vitest
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Logger } from "./logger";
import type { OutputChannel } from "vscode";

describe("Logger", () => {
  let mockOutputChannel: OutputChannel;

  beforeEach(() => {
    mockOutputChannel = {
      appendLine: vi.fn(),
      // 他のOutputChannelのメソッドは不要
    } as unknown as OutputChannel;
    Logger.initialize(mockOutputChannel);
  });

  it("should log error messages", () => {
    Logger.error("err");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("ERROR: err");
  });

  it("should log warn messages", () => {
    Logger.warn("warn");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("WARN: warn");
  });

  it("should log log messages", () => {
    Logger.log("log");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("LOG: log");
  });

  it("should log debug messages", () => {
    Logger.debug("debug");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("DEBUG: debug");
  });

  it("should log info messages", () => {
    Logger.info("info");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("INFO: info");
  });

  it("should log trace messages", () => {
    Logger.trace("trace");
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith("TRACE: trace");
  });
});
