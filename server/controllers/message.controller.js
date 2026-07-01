import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";

// Text-based Ai chat message controller

export const textMessageController = async (req, res) => {
  try {
    const { userId } = req.user._id;
    //check credits
    if (req.user.credits < 2) {
      return res.status(400).json({ success: false, message: "You don't have enough credits to use this feature" });
    }

    const { chatId, prompt } = req.body;

    const chat = await ChatfindOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };

    res.status(200).json({ success: true, reply });

    chat.message.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// image Generation message controller

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // checking credits

    if (req.user.credits < 2) {
      return res.status(400).json({ success: false, message: "You don't have enough credits to use this feature" });
    }

    const { prompt, chatId, isPublished } = req.body;

    // find chat

    const chat = await Chat.findOne({ userId, _id: chatId });

    //push user message

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: true,
    });

    // Encode the prompt

    const encodePrompt = encodeURIComponent(prompt);
    // Construct Imagekit Ai generation URL

    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/Mythos/${Date.now()}.png?tr=w-800,h-800`;

    // Trigger generating by fetching from ImageKit
    const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });

    //    Convert to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

    //Upload to imageKit media library
    const uplaodResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "Mythos",
    });

    const reply = { role: "assistant", content: uplaodResponse.url, timestamp: Date.now(), isImage: true, isPublished };

    res.status(200).json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
