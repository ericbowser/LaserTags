// src/mocks/openAiApiMock.js
import {jest} from "@jest/globals";

const mockImageUrl = jest.fn();
const mockGeneratedImage = () => ({
  loginBackendLaser: () => mockImageUrl.mockResolvedValue('mocked-image-url').mockResolvedValue('mocked-image-url')
});

export {mockGeneratedImage};