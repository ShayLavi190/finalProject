const db = require("./firebase");
const { encryptData } = require("./utils");
const SECRET_KEY = "Model1FP";

const saveOrUpdateUser = async (req, res) => {
  const { id, name, address, phone, emergencyPhone, bankAccountNumber, bankBranchNumber, selectedBank, selectedhealthFund, healthFundAccountNumber } = req.body;

  if (!id || id.length !== 9) {
    return res.status(400).json({ success: false, message: "Invalid ID provided" });
  }

  const userData = {
    id,
    name,
    address,
    phone,
    emergencyPhone,
    bankAccountNumber,
    bankBranchNumber,
    selectedBank,
    selectedhealthFund,
    healthFundAccountNumber,
  };

  try {
    const encryptedData = encryptData(userData, SECRET_KEY);
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (doc.exists) {
      await userRef.update({ data: encryptedData });
      return res.status(200).json({ success: true, message: "User data updated successfully" });
    } else {
      await userRef.set({ data: encryptedData });
      return res.status(201).json({ success: true, message: "User data saved successfully" });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, message: "Failed to save user data" });
  }
};

const savePermissions = async (req, res) => {
  const { id, permissions } = req.body;

  if (!id || !permissions) {
    return res.status(400).json({ success: false, message: "ID and permissions are required" });
  }

  try {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (doc.exists) {
      await userRef.update({ permissions });
      return res.status(200).json({ success: true, message: "Permissions updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error saving permissions:", error);
    res.status(500).json({ success: false, message: "Failed to save permissions" });
  }
};
const resetPerformance = async (req, res) => {
  try {
    const { userId, tasks } = req.body;

    if (!userId || !tasks) {
      return res.status(400).json({ error: "Missing userId or tasks." });
    }

    const performanceRef = db.collection("performance").doc(userId);
    await performanceRef.set({
      tasks,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ message: "Performance data saved successfully." });
  } catch (error) {
    console.error("Error saving performance data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { saveOrUpdateUser, savePermissions, resetPerformance };
