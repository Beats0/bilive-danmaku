#import <Cocoa/Cocoa.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSLog(@"%@", [[[NSFontManager sharedFontManager] availableFontFamilies] description]);
    }
    return 0;
}
