---
title: "Ending the Epic Battle for Overlay Icons"
description: "A solution for automatically rearranging the sort order of the overlay icons in the Windows registry."
pubDate: 2017-01-13
tags: ["Python","Windows"]
---

An epic battle is going on deep inside the registry of my Windows PC. The combatants: Dropbox, Google Drive, OneDrive and the allied forces of TortoiseGit, TortoiseHg and TortoiseSVN. The weapons: blank spaces.

Let me explain: As so often, wars start when there are certain scarce or indivisible resources that are in demand by multiple contenders. In this case, the resources are so-called "overlay icons". These are the tiny additions displayed in the lower left corner of the symbols for files and folders in the Windows explorer, like the small arrow that indicates a shortcut. Some third-party tools like TortoiseGit or Dropbox also make good use of them to show the state of the files in the repository or the cloud, like whether the file has been changed, is not yet synchronized and so on.

![Overlay Icons](/img/overlay-icon-battle.png)

The problem is: Windows has only 15 slots available for such overlay icons. Yes, even in the latest Windows ~~10~~ 11, you still only have 15 slots. While it didn't matter much in former times, when they were rarely used, it has become a real problem today. Several cloud services are now fighting for these few slots, and if you're a developer, you will probably like TortoiseGit and other clients for source repositories which also use the overlay icons to display the state of the files in the registry in the Windows explorer, which is tremendously helpful. While all the Tortoise clients share the same icons, these are already 9 of the available slots.

This means that in the end, not all overlay icons will be displayed. Windows simply sorts the registered overlay icons alphabetically in the registry and uses only the first 15 of them. Soon, software vendors found that there is a simple trick to get their icons into the top 10 of the overlay icons in front of all the others, just by prepending the icon names with a blank. This of course spurred an absurd arms race of vendors prepending names with more and more blanks in order to overtrump others already using this trick.

The Tortoise clients finally gave up adding blanks, with the annoying consequence that whenever there was an update of one of the cloud clients, and they re-registered their icon handlers with a nasty amount of blanks, my so useful overlay icons for the Tortoise clients disappeared.

Being tired of renaming the icon handlers in the registry by hand, I wrote the following Python script to finally end that epic battle. It simply removes all the prepended blanks from the icon names and adds only one blank to those icons I really want to use. Before applying the changes, it also creates a backup file of the unaltered settings that can be loaded with the registry editor in case you change your mind and want to restore everything:

```python
#! /usr/bin/python3

import codecs
import os
import winreg as reg

# names of all overlay icons that shall be boosted:

boost = """
    Tortoise1Normal
    Tortoise2Modified
    Tortoise3Conflict
    Tortoise4Locked
    Tortoise5ReadOnly
    Tortoise6Deleted
    Tortoise7Added
    Tortoise8Ignored
    Tortoise9Unversioned
    DropboxExt01
    DropboxExt02
    DropboxExt03
    DropboxExt04
    DropboxExt05
    DropboxExt06
"""

boost = set(boost.split())

backup_filename = 'IconOverlayBackup.reg'

key = (r'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion'
       r'\Explorer\ShellIconOverlayIdentifiers')
sub_key = key.split('\\', 1)[1]

def main():

    with reg.OpenKey(reg.HKEY_LOCAL_MACHINE, sub_key) as base:
        backup = []
        names = set()
        deletes = []
        renames = []
        i = 0
        while True:
            try:
                name = reg.EnumKey(base, i)
                value = reg.QueryValue(base, name)
            except OSError:
                break
            backup.append((name, value))
            core = name.strip()
            if core in names:
                deletes.append(name)
            else:
                names.add(core)
                if core in boost:
                    core = ' ' + core
                if core != name:
                    renames.append((name, core))
            i += 1

        if deletes or renames:
            print('Write backup file', backup_filename)
            with codecs.open(backup_filename, 'w', 'utf_16_le') as backup_file:
                wr = backup_file.write
                wr('\ufeff')
                wr('Windows Registry Editor Version 5.00\r\n\r\n')
                wr('[{}]\r\n\r\n'.format(key))
                for name, value in backup:
                    wr('[{}\\{}]\r\n'.format(key, name))
                    wr('@="{}"\r\n\r\n'.format(value))

            for name in deletes:
                print('Delete', repr(name))
                reg.DeleteKey(base, name)
            for old_name, new_name in renames:
                print('Rename', repr(old_name), 'to', repr(new_name))
                value = reg.QueryValue(base, old_name)
                reg.CreateKey(base, new_name)
                reg.SetValue(base, new_name, reg.REG_SZ, value)
                reg.DeleteKey(base, old_name)

            print('Restart Windows Explorer')
            if not os.system('taskkill /F /IM explorer.exe'):
                os.system('start explorer.exe')

        else:
            print('Nothing to rename')


if __name__ == '__main__':
    main()
```

This script also demonstrates how you can modify the Windows registry using only Python and the batteries included in the standard library.

Note that this script needs to run with elevated privileges so that it can change the registry. One way to achieve this: Create a shortcut file referencing the Python executable on the desktop, open the "properties" dialog, add the full path to the above script as argument to its target and select "run as administrator" under the advanced options (do not set "run as administrator" under the compatibility section, because this would then apply to the Python executable in general). The backup file will be created in the directory that you specify under "start in" in the "properties" dialog.

Unfortunately, you still need to decide which icons are most useful - you cannot have them all. You also need to run this script every time the icons get screwed up.

In order to make the changes effective, the Windows Explorer process must be restarted. Usually this happens only when rebooting Windows, or logging off and in again. To make this less troublesome, I have added two lines in the above script that forcefully terminate and restart the Windows Explorer process. This is another reason why the script must be run with elevated privileges.

Please note that 32bit Windows programs use the WOW6432Node in the registry, which is not changed by this script. I have created a [GitHub repository](https://github.com/Cito/fix-overlay-icons) with a more sophisticated script that makes the changes in both nodes, and I recommend that you [download the script](https://raw.githubusercontent.com/Cito/fix-overlay-icons/main/fix-overlay-icons.py) from there.

By the way, another notorious Windows problem with desktop icons is that it sometimes completely jumbles or forgets the position of the icons on the desktop, particularly when the Windows Explorer process restarts, which can be pretty annoying when you just carefully arranged everything to your likes. Whenever this happens, I restore the icons with [DesktopOK](http://www.softwareok.com/?seite=Freeware/DesktopOK), a small but very useful utility provided by Nenad Hrg as freeware.

## Updates

**Oct 31, 2017:**
Charles Ruhs pointed out that instead of rebooting, one can simply restart the Windows Explorer.

**Feb 13, 2018:**
Robert van Drie suggested to create a backup of the current settings.

**Oct 5, 2021:**
Note that the same problem still exists in Windows 11.

**Jan 26, 2023:**
Joseph Deck reminded me to support 32bit programs as well and to put this on GitHub.
