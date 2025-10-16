import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadDocument } from '../downloadDocument';

describe('downloadDocument', () => {
  beforeEach(() => {
    global.fetch = vi.fn();

    // Mock createObjectURL if it doesn't exist in the URL object
    if (!window.URL.createObjectURL) {
      Object.defineProperty(window.URL, 'createObjectURL', {
        value: vi.fn(() => 'mockDownloadUrl'),
        writable: true,
      });
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should download a document if the fetch status is 200', async () => {
    const mockBlob = new Blob(['mock content'], { type: 'application/pdf' });
    (global.fetch as any).mockResolvedValue({
      status: 200,
      blob: vi.fn().mockResolvedValue(mockBlob),
    });

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const clickSpy = vi.fn();
    const removeSpy = vi.fn();

    // Mock link creation and set it as a Node
    const mockLink = document.createElement('a');
    mockLink.download = 'test.pdf';
    mockLink.click = clickSpy;
    mockLink.remove = removeSpy;

    vi.spyOn(document, 'createElement').mockImplementation(() => mockLink);

    await downloadDocument('https://example.com/file.pdf', 'test.pdf');

    expect(fetch).toHaveBeenCalledWith('https://example.com/file.pdf');
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(mockLink.download).toEqual('test.pdf');
    expect(mockLink.href).contains('mockDownloadUrl');
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should not download a document if the fetch status is not 200', async () => {
    (global.fetch as any).mockResolvedValue({ status: 404 });

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const clickSpy = vi.fn();
    const removeSpy = vi.fn();

    vi.spyOn(document, 'createElement').mockImplementation(() => {
      const mockLink = document.createElement('a');
      mockLink.click = clickSpy;
      mockLink.remove = removeSpy;
      return mockLink;
    });

    await downloadDocument('https://example.com/nonexistent.pdf', 'nonexistent.pdf');

    expect(fetch).toHaveBeenCalledWith('https://example.com/nonexistent.pdf');
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    expect(appendChildSpy).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });
});
