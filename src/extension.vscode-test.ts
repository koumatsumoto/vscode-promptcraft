import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("Type strictness: should not allow assigning number to string", () => {
    // @ts-expect-error
    const s: string = 123;
    assert.strictEqual(typeof s, "number");
  });

  test("Type strictness: should catch undefined property access", () => {
    type User = { name: string };
    const user: User = { name: "alice" };
    // @ts-expect-error
    const age = user.age;
    assert.strictEqual(age, undefined);
  });
});
