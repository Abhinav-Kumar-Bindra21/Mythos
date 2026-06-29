import validator from "validator";

export const validateUser = (data) => {
  const mandatoryFields = ["fullName", "email", "password"];

  const isAllowed = mandatoryFields.every((field) => data[field] && data[field].trim());

  if (!isAllowed) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(data.email)) {
    throw new Error("Not an vaild email");
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Not an strong password");
  }

  if (!(data.fullName.length >= 3 && data.fullName.length < 35)) {
    throw new Error("fullName should have atleast 3 char and atmost 20 char");
  }
};
