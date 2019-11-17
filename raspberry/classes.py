class VideoFrame:
  def __init__(self, width, height, qrcodes, path):
    self.width = width
    self.height = height
    self.qrcodes = qrcodes
    self.path = path

  def to_dict(self):
    qrcodes_dict = []
    for qr in self.qrcodes:
      qrcodes_dict.append(qr.to_dict())
    return {
      "width": self.width,
      "height": self.height,
      "qrcodes": qrcodes_dict,
      "path": self.path
    }

class QRCode:
  def __init__(self, name, bounding_box):
    self.name = name
    self.bounding_box = bounding_box

  def to_dict(self):
    return {
      "name": self.name,
      "box": self.bounding_box.to_dict()
    }

class BoundingBox:
  def __init__(self, pt1, pt2):
    self.pt1 = Point(int(pt1.x),int(pt1.y))
    self.pt2 = Point(int(pt2.x),int(pt2.y))

  def to_dict(self):
    return {
      "pt1" : self.pt1.to_dict(),
      "pt2" : self.pt2.to_dict(),
    }

class Point:
  def __init__(self, x, y):
    self.x = x
    self.y = y

  def to_dict(self):
    return {
      "x": self.x,
      "y": self.y
    }