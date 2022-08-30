import shutil
from os import listdir
from os.path import isfile, join
import logging


src = '/root/Kalila/next/frontend/'
dest = '/root/Kalila/next/frontend-editions/'
print(f"copying source files")

def ignore_files(path, names):
  if "node_modules" in path:
    return names
  if "rust-src" in path:
    return names
  if "tmp" in path:
    return names
  if "public/pages" in path:
    return names
  if "dist" in path:
    return names
  return []

shutil.copytree(src, dest, ignore=ignore_files, dirs_exist_ok=True)
os.remove(f"{dest}.env")
shutil.move(f"{dest}edition.env", f"{dest}.env")
