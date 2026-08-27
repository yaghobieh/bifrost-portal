# Bear UI — component list and props

Source: `bear/src/components`. Package `@forgedevstack/bear`. Do not invent prop names.

Counted **180** component folders.

## Image (HTML `<img>` equivalent)

Bear `Image` renders an `<img>` (plus optional skeleton/fallback). Marketing Pages should insert a real `<img src alt width height loading>` and map these Bear props in Content:

Interface: `null` extends ``


## Full catalog

### Accordion

`AccordionProps` extends ``

- `children`: `ReactNode`
- `allowMultiple?`: `boolean`
- `defaultOpen?`: `string[]`
- `className?`: `string`
- `testId?`: `string`
- `id?`: `string`

### ActionIcon

_No dedicated Props interface found in source._

### ActiveBar

_No dedicated Props interface found in source._

### ActivityItem

_No dedicated Props interface found in source._

### Affix

_No dedicated Props interface found in source._

### Alert

_No dedicated Props interface found in source._

### AlertDialog

`AlertDialogProps` extends ``

- `id?`: `string`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `onConfirm`: `() => void`
- `title`: `string`
- `description?`: `string | ReactNode`
- `confirmText?`: `string`
- `cancelText?`: `string`
- `confirmVariant?`: `BearVariant | (string & {})`
- `loading?`: `boolean`
- `loadingText?`: `string`
- `closeOnBackdrop?`: `boolean`
- `closeOnEscape?`: `boolean`
- `icon?`: `ReactNode`
- `className?`: `string`
- `testId?`: `string`

### Anchor

_No dedicated Props interface found in source._

### AnimatedCounter

_No dedicated Props interface found in source._

### AppBar

`AppBarProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children?`: `ReactNode`
- `position?`: `AppBarPosition`
- `variant?`: `AppBarVariant`
- `color?`: `AppBarColor`
- `className?`: `string`
- `leftContent?`: `ReactNode`
- `rightContent?`: `ReactNode`
- `centerContent?`: `ReactNode`
- `elevation?`: `boolean`
- `dense?`: `boolean`
- `disableGutters?`: `boolean`
- `enableColorOnDark?`: `boolean`

### AppShell

_No dedicated Props interface found in source._

### AspectRatio

_No dedicated Props interface found in source._

### Autocomplete

`AutocompleteProps` extends ``

- `id?`: `string`
- `options`: `AutocompleteOption[]`
- `value?`: `string`
- `onChange?`: `(value: string) => void`
- `onSelect?`: `(option: AutocompleteOption) => void`
- `placeholder?`: `string`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `disabled?`: `boolean`
- `freeSolo?`: `boolean`
- `loading?`: `boolean`
- `filterOptions?`: `(options: AutocompleteOption[], inputValue: string) => AutocompleteOption[]`
- `className?`: `string`
- `testId?`: `string`

### Avatar

`AvatarGroupProps` extends ``

- `children`: `ReactNode`
- `max?`: `number`
- `size?`: `AvatarProps['size']`
- `className?`: `string`

### BackTop

_No dedicated Props interface found in source._

### Backdrop

_No dedicated Props interface found in source._

### Badge

_No dedicated Props interface found in source._

### Banner

_No dedicated Props interface found in source._

### BearLoader

`BearLoaderProps` extends ``

- `id?`: `string`
- `size?`: `'sm' | 'md' | 'lg' | 'xl'`
- `text?`: `string`
- `fullscreen?`: `boolean`
- `duration?`: `number`
- `onComplete?`: `() => void`
- `className?`: `string`
- `testId?`: `string`

### BearLogo

`EmberLogoProps` extends ``

- `size?`: `number`
- `className?`: `string`
- `animated?`: `boolean`

### Biometric

`BiometricProps` extends ``

- `id?`: `string`
- `type?`: `BiometricType`
- `size?`: `BiometricSize`
- `status?`: `BiometricStatus`
- `label?`: `string`
- `successLabel?`: `string`
- `errorLabel?`: `string`
- `scanningLabel?`: `string`
- `onScan?`: `() => void`
- `onSuccess?`: `() => void`
- `onError?`: `() => void`
- `disabled?`: `boolean`
- `animated?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### Blockquote

_No dedicated Props interface found in source._

### BottomNavigation

`BottomNavigationProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `items`: `BottomNavItem[]`
- `value?`: `string`
- `onChange?`: `(id: string) => void`
- `showLabels?`: `boolean | 'always' | 'active'`
- `variant?`: `BottomNavigationVariant`
- `className?`: `string`

### BottomSheet

`BottomSheetProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title?`: `ReactNode`
- `children`: `ReactNode`
- `size?`: `BottomSheetSize`
- `showCloseButton?`: `boolean`
- `closeOnBackdrop?`: `boolean`
- `closeOnEscape?`: `boolean`
- `showHandle?`: `boolean`
- `enableScroll?`: `boolean`
- `isSticky?`: `boolean`
- `className?`: `string`

### Box

_No dedicated Props interface found in source._

### Breadcrumbs

`BreadcrumbsProps` extends ``

- `items`: `BreadcrumbItem[]`
- `separator?`: `ReactNode`
- `maxItems?`: `MaxVisibleInput`
- `itemsBeforeCollapse?`: `number`
- `itemsAfterCollapse?`: `number`
- `className?`: `string`
- `size?`: `BreadcrumbSize`
- `showHomeIcon?`: `boolean`
- `testId?`: `string`
- `id?`: `string`

### Button

_No dedicated Props interface found in source._

### ButtonGroup

_No dedicated Props interface found in source._

### Calendar

`CalendarDayProps` extends ``

- `testId?`: `string`
- `date`: `Date`
- `day`: `number`
- `isCurrentMonth`: `boolean`
- `isSelected`: `boolean`
- `isToday`: `boolean`
- `isDisabled`: `boolean`
- `isHighlighted?`: `boolean`

### Card

_No dedicated Props interface found in source._

### CardSkeleton

_No dedicated Props interface found in source._

### Carousel

`CarouselProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `autoPlay?`: `number`
- `showDots?`: `boolean`
- `showArrows?`: `boolean`
- `loop?`: `boolean`
- `slidesToShow?`: `number`
- `gap?`: `number`
- `pauseOnHover?`: `boolean`
- `onSlideChange?`: `(index: number) => void`
- `transition?`: `CarouselTransition`
- `transitionDuration?`: `number`
- `indicator?`: `CarouselIndicator`
- `thumbnails?`: `string[]`
- `thumbnailSize?`: `number`
- `keyboard?`: `boolean`
- `draggable?`: `boolean`
- `showProgress?`: `boolean`
- `showCounter?`: `boolean`
- `activeColor?`: `string`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`

### Cascader

`CascaderProps` extends ``

- `id?`: `string`
- `options`: `CascaderOption[]`
- `value?`: `string[]`
- `onChange?`: `(value: string[], selectedOptions: CascaderOption[]) => void`
- `placeholder?`: `string`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `disabled?`: `boolean`
- `loading?`: `boolean`
- `clearable?`: `boolean`
- `size?`: `CascaderSize`
- `variant?`: `CascaderVariant`
- `expandTrigger?`: `CascaderExpandTrigger`
- `showFullPath?`: `boolean`
- `pathSeparator?`: `string`
- `changeOnSelect?`: `boolean`
- `className?`: `string`
- `testId?`: `string`
- `translations?`: `Partial<CascaderTranslations>`
- `icon?`: `ReactNode`

### Chart

_No dedicated Props interface found in source._

### Chat

`ChatProps` extends ``

- `id?`: `string`
- `messages`: `ChatMessage[]`
- `onSend?`: `(message: string) => void`
- `isLoading?`: `boolean`
- `placeholder?`: `string`
- `header?`: `ReactNode`
- `footer?`: `ReactNode`
- `showTimestamps?`: `boolean`
- `showStatus?`: `boolean`
- `showAvatars?`: `boolean`
- `userAvatar?`: `string`
- `botAvatar?`: `string`
- `isTyping?`: `boolean`
- `typingText?`: `string`
- `className?`: `string`
- `height?`: `number | string`
- `testId?`: `string`
- `disabled?`: `boolean`

### Checkbox

_No dedicated Props interface found in source._

### CheckboxCard

_No dedicated Props interface found in source._

### Chip

`ChipProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `variant?`: `'filled' | 'outlined' | 'soft'`
- `color?`: `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'`
- `size?`: `'sm' | 'md' | 'lg'`
- `icon?`: `ReactNode`
- `avatar?`: `ReactNode`
- `onDelete?`: `() => void`
- `onClick?`: `() => void`
- `disabled?`: `boolean`
- `className?`: `string`

### ChipGroup

_No dedicated Props interface found in source._

### CloseButton

`CloseButtonProps` extends ``

- `id?`: `string`
- `onClick?`: `() => void`
- `size?`: `BearSize`
- `disabled?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### CodeBlock

_No dedicated Props interface found in source._

### CodeEditor

`CodeEditorProps` extends ``

- `id?`: `string`
- `value`: `string`
- `onChange?`: `(value: string) => void`
- `language?`: `CodeEditorLanguage`
- `theme?`: `'dark' | 'light'`
- `customTheme?`: `Partial<CodeEditorTheme>`
- `placeholder?`: `string`
- `showLineNumbers?`: `boolean`
- `showGutter?`: `boolean`
- `highlightActiveLine?`: `boolean`
- `readOnly?`: `boolean`
- `fontSize?`: `number`
- `fontFamily?`: `string`
- `tabSize?`: `number`
- `autoIndent?`: `boolean`
- `autoCloseBrackets?`: `boolean`
- `wordWrap?`: `boolean`
- `minHeight?`: `string | number`
- `maxHeight?`: `string | number`
- `height?`: `string | number`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`
- `onFocus?`: `() => void`
- `onBlur?`: `() => void`

### Collapsible

`CollapsibleProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `trigger`: `ReactNode`
- `open?`: `boolean`
- `defaultOpen?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `disabled?`: `boolean`
- `className?`: `string`
- `triggerClassName?`: `string`
- `contentClassName?`: `string`
- `animationDuration?`: `number`

### ColorPicker

`ColorPickerProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `value?`: `string`
- `onChange?`: `(color: string) => void`
- `presets?`: `string[]`
- `showInput?`: `boolean`
- `showPresets?`: `boolean`
- `disabled?`: `boolean`
- `label?`: `string`
- `size?`: `'sm' | 'md' | 'lg'`
- `className?`: `string`

### ColorSwatch

_No dedicated Props interface found in source._

### Columns

`ColumnsProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `count?`: `1 | 2 | 3 | 4 | 5 | 6 | 'auto'`
- `gap?`: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `fill?`: `boolean`
- `minWidth?`: `string | number`
- `className?`: `string`
- `style?`: `CSSProperties`

### CommandPalette

`CommandPaletteProps` extends ``

- `id?`: `string`
- `commands`: `CommandItem[]`
- `open?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `placeholder?`: `string`
- `showRecent?`: `boolean`
- `maxRecent?`: `number`
- `recentIds?`: `string[]`
- `onRecentChange?`: `(ids: string[]) => void`
- `groupByCategory?`: `boolean`
- `filterFn?`: `(command: CommandItem, query: string) => boolean`
- `triggerKey?`: `string`
- `className?`: `string`
- `testId?`: `string`
- `translations?`: `Partial<CommandPaletteTranslations>`
- `icon?`: `ReactNode`
- `footer?`: `ReactNode`

### Confetti

`ConfettiProps` extends ``

- `id?`: `string`
- `active?`: `boolean`
- `count?`: `number`
- `duration?`: `number`
- `colors?`: `string[]`
- `originX?`: `number`
- `originY?`: `number`
- `spread?`: `number`
- `velocity?`: `number`
- `gravity?`: `number`
- `autoHide?`: `boolean`
- `onComplete?`: `() => void`
- `className?`: `string`
- `testId?`: `string`

### Container

_No dedicated Props interface found in source._

### ContextMenu

`ContextMenuProps` extends ``

- `id?`: `string`
- `items`: `ContextMenuEntry[]`
- `children`: `ReactNode`
- `disabled?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `testId?`: `string`

### CopyButton

`CopyButtonProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `value`: `string`
- `children?`: `ReactNode`
- `onCopy?`: `(value: string) => void`
- `timeout?`: `number`
- `size?`: `'sm' | 'md' | 'lg'`
- `variant?`: `'default' | 'ghost' | 'outline'`
- `className?`: `string`
- `copiedText?`: `string`
- `copyText?`: `string`
- `showText?`: `boolean`

### CountdownTimer

`CountdownTimerProps` extends ``

- `id?`: `string`
- `targetDate?`: `Date | string | number`
- `duration?`: `number`
- `variant?`: `CountdownTimerVariant | (string & {})`
- `size?`: `CountdownTimerSize`
- `showDays?`: `boolean`
- `showHours?`: `boolean`
- `showMinutes?`: `boolean`
- `showSeconds?`: `boolean`
- `showLabels?`: `boolean`
- `showSeparator?`: `boolean`
- `separator?`: `string | number`
- `labels?`: `{ days?: string; hours?: string; minutes?: string; seconds?: string }`
- `onComplete?`: `() => void`
- `onTick?`: `(remaining: CountdownTime) => void`
- `paused?`: `boolean`
- `render?`: `(time: CountdownTime) => ReactNode`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`
- `digitTypographyProps?`: `Partial<TypographyProps>`
- `labelTypographyProps?`: `Partial<TypographyProps>`
- `separatorTypographyProps?`: `Partial<TypographyProps>`
- `narrowLayout?`: `boolean`

### CreditInput

`CreditInputProps` extends ``

- `id?`: `string`
- `value?`: `Partial<CreditCardValue>`
- `onChange?`: `(value: CreditCardValue) => void`
- `mode?`: `CreditInputMode`
- `showName?`: `boolean`
- `size?`: `CreditInputSize`
- `variant?`: `CreditInputVariant`
- `disabled?`: `boolean`
- `required?`: `boolean`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `acceptedCards?`: `CardType[]`
- `validateOnInput?`: `boolean`
- `className?`: `string`
- `testId?`: `string`
- `translations?`: `Partial<CreditInputTranslations>`
- `icon?`: `ReactNode`

### Cropper

`CropperProps` extends ``

- `src`: `string`
- `crop?`: `CropArea`
- `onCropChange?`: `(crop: CropArea) => void`
- `onCropComplete?`: `(crop: CropArea, croppedImageUrl: string) => void`
- `aspectRatio?`: `number | AspectRatioPreset`
- `shape?`: `CropShape`
- `zoom?`: `number`
- `onZoomChange?`: `(zoom: number) => void`
- `minZoom?`: `number`
- `maxZoom?`: `number`
- `rotation?`: `number`
- `onRotationChange?`: `(rotation: number) => void`
- `showZoomSlider?`: `boolean`
- `showRotationSlider?`: `boolean`
- `showGrid?`: `boolean`
- `gridOpacity?`: `number`
- `overlayColor?`: `string`
- `borderColor?`: `string`
- `borderWidth?`: `number`
- `width?`: `string | number`
- `height?`: `string | number`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`

### CssBaseline

`CssBaselineProps` extends ``

- `id?`: `string`
- `testId?`: `string`

### CurrencyInput

_No dedicated Props interface found in source._

### DataTable

_No dedicated Props interface found in source._

### DatePicker

_No dedicated Props interface found in source._

### DateRangePicker

_No dedicated Props interface found in source._

### Descriptions

_No dedicated Props interface found in source._

### DiffSquares

_No dedicated Props interface found in source._

### DiffViewer

`DiffViewerProps` extends ``

- `id?`: `string`
- `oldValue`: `string`
- `newValue`: `string`
- `viewMode?`: `DiffViewMode`
- `showLineNumbers?`: `boolean`
- `syntaxHighlight?`: `boolean`
- `language?`: `string`
- `oldTitle?`: `string`
- `newTitle?`: `string`
- `showStats?`: `boolean`
- `spacing?`: `DiffSpacing`
- `showLineHoverInfo?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### Divider

_No dedicated Props interface found in source._

### Dock

`DockProps` extends ``

- `id?`: `string`
- `items`: `DockItem[]`
- `position?`: `DockPosition`
- `iconSize?`: `number`
- `magnifiedSize?`: `number`
- `magnification?`: `boolean`
- `magnificationDistance?`: `number`
- `showLabels?`: `boolean`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### Drawer

`DrawerProps` extends ``

- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title?`: `string`
- `children`: `ReactNode`
- `side?`: `'left' | 'right' | 'top' | 'bottom'`
- `anchor?`: `'left' | 'right' | 'top' | 'bottom'`
- `variant?`: `'temporary' | 'persistent' | 'permanent'`
- `size?`: `'sm' | 'md' | 'lg' | 'xl'`
- `showCloseButton?`: `boolean`
- `closeOnBackdrop?`: `boolean`
- `closeOnEscape?`: `boolean`
- `className?`: `string`
- `container?`: `Element | DocumentFragment | null`
- `id?`: `string`
- `testId?`: `string`

### Dropdown

_No dedicated Props interface found in source._

### Editable

_No dedicated Props interface found in source._

### Em

_No dedicated Props interface found in source._

### EmojiPicker

`EmojiPickerProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `onSelect?`: `(emoji: string) => void`
- `size?`: `'sm' | 'md' | 'lg'`
- `maxHeight?`: `string | number`
- `className?`: `string`

### EmptyState

`EmptyStateProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `icon?`: `ReactNode`
- `title`: `string`
- `description?`: `string`
- `action?`: `ReactNode`
- `secondaryAction?`: `ReactNode`
- `className?`: `string`
- `size?`: `'sm' | 'md' | 'lg'`
- `variant?`: `'default' | 'card'`

### Fab

_No dedicated Props interface found in source._

### Fieldset

_No dedicated Props interface found in source._

### FileTree

`FileTreeProps` extends ``

- `id?`: `string`
- `items`: `FileTreeNode[]`
- `selectedId?`: `string`
- `defaultExpandedIds?`: `string[]`
- `onSelect?`: `(node: FileTreeNode) => void`
- `onExpand?`: `(nodeId: string, expanded: boolean) => void`
- `size?`: `'sm' | 'md' | 'lg'`
- `showLines?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### FileUpload

`FileUploadProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `onFilesSelect?`: `(files: File[]) => void`
- `onFileRemove?`: `(file: UploadedFile) => void`
- `accept?`: `string`
- `multiple?`: `boolean`
- `maxSize?`: `number`
- `maxFiles?`: `number`
- `disabled?`: `boolean`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `files?`: `UploadedFile[]`
- `showPreview?`: `boolean`
- `variant?`: `'dropzone' | 'button' | 'compact'`
- `icon?`: `ReactNode`
- `className?`: `string`

### Flex

_No dedicated Props interface found in source._

### FloatingChat

`FloatingChatProps` extends ``

- `id?`: `string`
- `messages`: `ChatMessage[]`
- `onSend?`: `(message: string) => void`
- `isLoading?`: `boolean`
- `isTyping?`: `boolean`
- `title?`: `string`
- `subtitle?`: `string`
- `avatar?`: `string`
- `position?`: `'bottom-right' | 'bottom-left'`
- `bottom?`: `number`
- `side?`: `number`
- `defaultOpen?`: `boolean`
- `open?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `trigger?`: `ReactNode`
- `badgeCount?`: `number`
- `header?`: `ReactNode`
- `welcomeMessage?`: `string`
- `poweredBy?`: `string`
- `className?`: `string`
- `testId?`: `string`

### Form

`FormFieldProps` extends ``

- `name`: `string`
- `value`: `unknown`
- `onChange`: `(value: unknown) => void`
- `onBlur`: `() => void`

### FormControl

_No dedicated Props interface found in source._

### FormField

_No dedicated Props interface found in source._

### FormSkeleton

`FormSkeletonProps` extends ``

- `fields?`: `number`
- `animation?`: `SkeletonAnimation`
- `id?`: `string`
- `testId?`: `string`
- `className?`: `string`

### Gauge

_No dedicated Props interface found in source._

### GlowCard

_No dedicated Props interface found in source._

### GradientText

`GradientTextProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `preset?`: `GradientPreset | (string & {})`
- `colors?`: `string[]`
- `direction?`: `GradientDirection`
- `animate?`: `boolean`
- `animationSpeed?`: `number`
- `as?`: `'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'`
- `weight?`: `'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### Grid

_No dedicated Props interface found in source._

### Heatmap

_No dedicated Props interface found in source._

### Highlight

_No dedicated Props interface found in source._

### HoverCard

_No dedicated Props interface found in source._

### Icon

_No dedicated Props interface found in source._

### Image

_No dedicated Props interface found in source._

### ImageAnnotation

_No dedicated Props interface found in source._

### ImageGallery

`LightboxProps` extends ``

- `images`: `GalleryImage[]`
- `currentIndex`: `number`
- `onClose`: `() => void`
- `onNavigate`: `(index: number) => void`

### Indicator

_No dedicated Props interface found in source._

### InfiniteScroll

_No dedicated Props interface found in source._

### Input

`InputPropsInput` extends ``

- `startAdornment?`: `ReactNode`
- `endAdornment?`: `ReactNode`

### InputGroup

`InputGroupProps` extends ``

- `id?`: `string`
- `label?`: `string`
- `description?`: `string`
- `error?`: `string`
- `helperText?`: `string`
- `required?`: `boolean`
- `fullWidth?`: `boolean`
- `children`: `ReactNode`
- `className?`: `string`
- `htmlFor?`: `string`
- `testId?`: `string`

### JsonViewer

`JsonViewerProps` extends ``

- `id?`: `string`
- `data`: `unknown`
- `defaultExpandDepth?`: `number`
- `expandAll?`: `boolean`
- `collapseAll?`: `boolean`
- `showDataTypes?`: `boolean`
- `showArrayIndices?`: `boolean`
- `showCopyButton?`: `boolean`
- `enableSearch?`: `boolean`
- `theme?`: `JsonViewerTheme`
- `rootName?`: `string | false`
- `onValueClick?`: `(path: string[], value: unknown) => void`
- `onCopy?`: `(value: unknown) => void`
- `className?`: `string`
- `testId?`: `string`

### Kanban

`KanbanProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `columns`: `KanbanColumn[]`
- `onColumnsChange?`: `(columns: KanbanColumn[]) => void`
- `onCardMove?`: `(cardId: string, fromColumnId: string, toColumnId: string, fromIndex: number, toIndex: number) => void`
- `renderCard?`: `(card: KanbanCard, columnId: string) => ReactNode`
- `renderColumnHeader?`: `(column: KanbanColumn) => ReactNode`
- `disabled?`: `boolean`
- `className?`: `string`

### Kbd

`KbdProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `keys?`: `string[]`
- `size?`: `'sm' | 'md' | 'lg'`
- `variant?`: `'default' | 'outline' | 'ghost'`
- `className?`: `string`

### Link

_No dedicated Props interface found in source._

### List

_No dedicated Props interface found in source._

### LoadingOverlay

_No dedicated Props interface found in source._

### Map

`MapProps` extends ``

- `id?`: `string`
- `markers?`: `MapMarker[]`
- `viewport?`: `MapViewport`
- `controlledViewport?`: `MapViewport`
- `onViewportChange?`: `(viewport: MapViewport) => void`
- `onMarkerClick?`: `(marker: MapMarker) => void`
- `onMapClick?`: `(lat: number, lng: number) => void`
- `onMarkerDrag?`: `(marker: MapMarker, lat: number, lng: number) => void`
- `tileProvider?`: `MapTileProvider`
- `customTileUrl?`: `string`
- `width?`: `string | number`
- `height?`: `string | number`
- `showZoomControls?`: `boolean`
- `showAttribution?`: `boolean`
- `scrollWheelZoom?`: `boolean`
- `doubleClickZoom?`: `boolean`
- `draggable?`: `boolean`
- `minZoom?`: `number`
- `maxZoom?`: `number`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`

### Mark

_No dedicated Props interface found in source._

### Marquee

`MarqueeProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `direction?`: `MarqueeDirection`
- `speed?`: `number`
- `pauseOnHover?`: `boolean`
- `pauseOnClick?`: `boolean`
- `play?`: `boolean`
- `loop?`: `number`
- `gradient?`: `boolean`
- `gradientColor?`: `string`
- `gradientWidth?`: `number`
- `gap?`: `number`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### Masonry

`MasonryProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `columns?`: `number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }`
- `gap?`: `number`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### MediaPlayer

_No dedicated Props interface found in source._

### MentionsInput

`MentionsInputProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `value?`: `string`
- `defaultValue?`: `string`
- `onChange?`: `(value: string, mentions: string[]) => void`
- `onMentionSelect?`: `(option: MentionOption) => void`
- `options`: `MentionOption[]`
- `trigger?`: `string`
- `placeholder?`: `string`
- `disabled?`: `boolean`
- `maxSuggestions?`: `number`
- `filterOptions?`: `(options: MentionOption[], query: string) => MentionOption[]`
- `size?`: `'sm' | 'md' | 'lg'`
- `fullWidth?`: `boolean`
- `className?`: `string`
- `multiline?`: `boolean`
- `rows?`: `number`

### Menu

`MenuDividerProps` extends ``

- `className?`: `string`

### MessageList

`MessageListProps` extends ``

- `id?`: `string`
- `testId?`: `string`
- `messages`: `MessageListMessage[]`
- `currentUserId?`: `string`
- `groupWindowMs?`: `number`
- `showDaySeparators?`: `boolean`
- `showAvatars?`: `boolean`
- `showTimestamps?`: `boolean`
- `autoScroll?`: `boolean`
- `virtualized?`: `boolean`
- `overscan?`: `number`
- `height?`: `number | string`
- `renderMessage?`: `(message: MessageListMessage) => ReactNode`
- `emptyState?`: `ReactNode`
- `formatDayLabel?`: `(date: Date) => string`
- `formatTimestamp?`: `(date: Date) => string`
- `translations?`: `Partial<MessageListTranslations>`
- `onNewMessagesClick?`: `() => void`
- `className?`: `string`

### Modal

`ModalProps` extends ``

- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title?`: `string`
- `children`: `ReactNode`
- `size?`: `ModalSize`
- `showCloseButton?`: `boolean`
- `closeOnBackdrop?`: `boolean`
- `closeOnEscape?`: `boolean`
- `disableEscapeKeyDown?`: `boolean`
- `hideBackdrop?`: `boolean`
- `keepMounted?`: `boolean`
- `lockBodyScroll?`: `boolean`
- `zIndex?`: `number`
- `cancelPreventScroll?`: `boolean`
- `isCancelBackgroundClick?`: `boolean`
- `className?`: `string`
- `footer?`: `ReactNode`
- `testId?`: `string`
- `id?`: `string`

### ModalsProvider

`ModalsProviderProps` extends ``

- `children`: `ReactNode`
- `translations?`: `Partial<ModalsTranslations>`
- `id?`: `string`
- `testId?`: `string`

### MultiSelect

`MultiSelectProps` extends ``

- `id?`: `string`
- `options`: `MultiSelectOption[]`
- `value?`: `string[]`
- `defaultValue?`: `string[]`
- `onChange?`: `(values: string[]) => void`
- `placeholder?`: `string`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `disabled?`: `boolean`
- `maxSelections?`: `number`
- `searchable?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### NavigableSelect

`NavigableSelectProps` extends ``

- `id?`: `string`
- `options`: `NavigableSelectOption[]`
- `value?`: `string | string[]`
- `defaultValue?`: `string | string[]`
- `onChange?`: `(value: string | string[]) => void`
- `multiple?`: `boolean`
- `searchable?`: `boolean`
- `placeholder?`: `string`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `disabled?`: `boolean`
- `size?`: `NavigableSelectSize`
- `fullWidth?`: `boolean`
- `maxVisible?`: `number`
- `maxSelections?`: `number`
- `emptyText?`: `string`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### NotificationCenter

`NotificationCenterProps` extends ``

- `id?`: `string`
- `notifications`: `NotificationItem[]`
- `onNotificationClick?`: `(notification: NotificationItem) => void`
- `onMarkAsRead?`: `(id: string) => void`
- `onMarkAllAsRead?`: `() => void`
- `onDismiss?`: `(id: string) => void`
- `onClearAll?`: `() => void`
- `maxVisible?`: `number`
- `groupByCategory?`: `boolean`
- `position?`: `NotificationCenterPosition`
- `trigger?`: `ReactNode`
- `open?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `className?`: `string`
- `testId?`: `string`
- `translations?`: `Partial<NotificationCenterTranslations>`
- `icon?`: `ReactNode`

### NumberFormatter

_No dedicated Props interface found in source._

### NumberInput

`NumberInputProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `value?`: `number`
- `onChange?`: `(value: number) => void`
- `min?`: `number`
- `max?`: `number`
- `step?`: `number`
- `disabled?`: `boolean`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `placeholder?`: `string`
- `size?`: `'sm' | 'md' | 'lg'`
- `variant?`: `'default' | 'filled' | 'outline'`
- `showButtons?`: `boolean`
- `buttonPosition?`: `'sides' | 'right'`
- `className?`: `string`
- `precision?`: `number`

### OTPInput

`OTPInputProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `length?`: `number`
- `value?`: `string`
- `onChange?`: `(value: string) => void`
- `onComplete?`: `(value: string) => void`
- `onFinish?`: `(value: string) => void`
- `disabled?`: `boolean`
- `error?`: `boolean`
- `autoFocus?`: `boolean`
- `mask?`: `boolean`
- `size?`: `'sm' | 'md' | 'lg'`
- `separator?`: `number`
- `className?`: `string`
- `variant?`: `OTPInputVariant`
- `layout?`: `OTPInputLayout`
- `stackOnNarrow?`: `boolean`
- `cancelAutoJump?`: `boolean`

### Overlay

`OverlayProps` extends ``

- `id?`: `string`
- `visible?`: `boolean`
- `opacity?`: `number`
- `color?`: `string`
- `blur?`: `number`
- `zIndex?`: `number`
- `fixed?`: `boolean`
- `children?`: `ReactNode`
- `onClick?`: `() => void`
- `className?`: `string`
- `testId?`: `string`

### OverlayPortal

_No dedicated Props interface found in source._

### PageHeader

`PageHeaderProps` extends ``

- `id?`: `string`
- `testId?`: `string`
- `title`: `ReactNode`
- `description?`: `ReactNode`
- `breadcrumbs?`: `ReactNode`
- `actions?`: `ReactNode`
- `className?`: `string`

### PageNav

`PageNavProps` extends ``

- `id?`: `string`
- `prev?`: `PageNavItem | null`
- `next?`: `PageNavItem | null`
- `size?`: `BearSize`
- `variant?`: `'default' | 'outlined' | 'filled'`
- `className?`: `string`
- `testId?`: `string`

### Pagination

_No dedicated Props interface found in source._

### Paper

_No dedicated Props interface found in source._

### PasswordInput

_No dedicated Props interface found in source._

### PhoneInput

`PhoneInputProps` extends ``

- `id?`: `string`
- `value?`: `PhoneValue`
- `onChange?`: `(value: PhoneValue) => void`
- `defaultCountry?`: `string`
- `placeholder?`: `string`
- `label?`: `string`
- `helperText?`: `string`
- `error?`: `string`
- `disabled?`: `boolean`
- `required?`: `boolean`
- `size?`: `PhoneInputSize`
- `variant?`: `PhoneInputVariant`
- `onlyCountries?`: `string[]`
- `excludeCountries?`: `string[]`
- `preferredCountries?`: `string[]`
- `searchable?`: `boolean`
- `showFlags?`: `boolean`
- `showDialCode?`: `boolean`
- `className?`: `string`
- `testId?`: `string`
- `translations?`: `Partial<PhoneInputTranslations>`
- `icon?`: `ReactNode`

### Popconfirm

`PopconfirmProps` extends ``

- `id?`: `string`
- `title`: `string`
- `description?`: `string`
- `onConfirm?`: `() => void`
- `onCancel?`: `() => void`
- `confirmText?`: `string`
- `cancelText?`: `string`
- `icon?`: `ReactNode`
- `placement?`: `PopconfirmPlacement`
- `disabled?`: `boolean`
- `children`: `ReactNode`
- `variant?`: `'default' | 'danger'`
- `testId?`: `string`

### Popover

`PopoverProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `content`: `ReactNode`
- `placement?`: `PopoverPlacement`
- `trigger?`: `'click' | 'hover'`
- `open?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `className?`: `string`
- `contentClassName?`: `string`
- `arrow?`: `boolean`
- `closeOnClickOutside?`: `boolean`
- `closeOnEscape?`: `boolean`
- `offset?`: `number`

### Portal

`PortalProps` extends ``

- `children`: `ReactNode`
- `target?`: `HTMLElement | null`
- `disabled?`: `boolean`

### Progress

`ProgressProps` extends ``

- `id?`: `string`
- `value`: `number`
- `max?`: `number`
- `bufferValue?`: `number`
- `size?`: `'sm' | 'md' | 'lg'`
- `color?`: `'default' | 'success' | 'warning' | 'danger' | 'info'`
- `showLabel?`: `boolean`
- `label?`: `string`
- `labelPosition?`: `'inside' | 'outside'`
- `striped?`: `boolean`
- `animated?`: `boolean`
- `indeterminate?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### PropsPlayground

`PropsPlaygroundProps` extends ``

- `id?`: `string`
- `config`: `PropsConfig`
- `render`: `(values: PropValues) => ReactNode`
- `title?`: `string`
- `size?`: `BearSize`
- `defaultCollapsed?`: `boolean`
- `showReset?`: `boolean`
- `columns?`: `1 | 2 | 3 | 4`
- `className?`: `string`
- `testId?`: `string`

### QRCode

`QRCodeProps` extends ``

- `id?`: `string`
- `value`: `string`
- `size?`: `number`
- `level?`: `'L' | 'M' | 'Q' | 'H'`
- `bgColor?`: `string`
- `fgColor?`: `string`
- `includeMargin?`: `boolean`
- `imageUrl?`: `string`
- `imageSize?`: `number`
- `renderAs?`: `'canvas' | 'svg'`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`

### Radio

`RadioGroupProps` extends ``

- `name`: `string`
- `value?`: `string`
- `defaultValue?`: `string`
- `onChange?`: `(value: string) => void`
- `children?`: `ReactNode`
- `direction?`: `'row' | 'column'`
- `size?`: `BearSize`
- `variant?`: `BearVariant`
- `disabled?`: `boolean`
- `gap?`: `number`
- `label?`: `ReactNode`
- `error?`: `boolean`
- `helperText?`: `string`
- `className?`: `string`
- `testId?`: `string`

### RadioCard

_No dedicated Props interface found in source._

### Rating

`RatingStarIconProps` extends ``

- `size`: `number`
- `state`: `RatingStarState`
- `color`: `string`
- `emptyColor`: `string`

### ResizablePanel

`ResizablePanelProps` extends ``

- `id?`: `string`
- `first`: `ReactNode`
- `second`: `ReactNode`
- `direction?`: `'horizontal' | 'vertical'`
- `defaultSize?`: `number`
- `minSize?`: `number`
- `maxSize?`: `number`
- `onResize?`: `(size: number) => void`
- `className?`: `string`
- `testId?`: `string`

### ResizableTextarea

_No dedicated Props interface found in source._

### Result

_No dedicated Props interface found in source._

### RichEditor

`ToolbarButtonProps` extends ``

- `icon`: `ReactNode`
- `title`: `string`
- `active?`: `boolean`
- `onClick`: `() => void`
- `disabled?`: `boolean`

### RingProgress

_No dedicated Props interface found in source._

### ScrollArea

`ScrollAreaProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `children`: `ReactNode`
- `className?`: `string`
- `orientation?`: `'vertical' | 'horizontal' | 'both'`
- `scrollbarSize?`: `'sm' | 'md' | 'lg'`
- `scrollbarVariant?`: `'default' | 'minimal' | 'hidden'`
- `maxHeight?`: `number | string`
- `maxWidth?`: `number | string`

### SegmentedControl

`SegmentedControlProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `items`: `SegmentedControlItem[]`
- `value?`: `string`
- `defaultValue?`: `string`
- `onChange?`: `(value: string) => void`
- `size?`: `'sm' | 'md' | 'lg'`
- `fullWidth?`: `boolean`
- `disabled?`: `boolean`
- `className?`: `string`

### Select

_No dedicated Props interface found in source._

### Sidebar

`SidebarProps` extends ``

- `items`: `SidebarItem[]`
- `collapsed?`: `boolean`
- `onCollapsedChange?`: `(collapsed: boolean) => void`
- `width?`: `number | string`
- `collapsedWidth?`: `number | string`
- `header?`: `ReactNode`
- `footer?`: `ReactNode`
- `showHeader?`: `boolean`
- `activeItemId?`: `string`
- `onItemClick?`: `(item: SidebarItem) => void`
- `activeVariant?`: `SidebarActiveVariant`
- `fullHeight?`: `boolean`
- `variant?`: `SidebarVariant`
- `position?`: `SidebarPosition`
- `className?`: `string`
- `style?`: `CSSProperties`
- `testId?`: `string`
- `id?`: `string`

### SignPad

_No dedicated Props interface found in source._

### Skeleton

_No dedicated Props interface found in source._

### Slider

_No dedicated Props interface found in source._

### SliderRange

_No dedicated Props interface found in source._

### Snackbar

`SnackbarProps` extends ``

- `open`: `boolean`
- `message?`: `ReactNode`
- `description?`: `ReactNode`
- `severity?`: `SnackbarSeverity`
- `action?`: `ReactNode`
- `autoHideDuration?`: `number | null`
- `onClose?`: `() => void`
- `anchorOrigin?`: `{`
- `vertical`: `SnackbarAnchorOriginVertical`
- `horizontal`: `SnackbarAnchorOriginHorizontal`
- `offsetX?`: `number`
- `offsetY?`: `number`
- `size?`: `SnackbarSize`
- `progress?`: `number | null`
- `progressPosition?`: `SnackbarProgressPosition`
- `progressColor?`: `SnackbarProgressColor`
- `countdownProgress?`: `boolean`
- `showCloseButton?`: `boolean`
- `closeOnClickOutside?`: `boolean`
- `container?`: `Element | DocumentFragment | null`
- `className?`: `string`
- `id?`: `string`
- `testId?`: `string`

### Sparkline

_No dedicated Props interface found in source._

### SpeedDial

_No dedicated Props interface found in source._

### Spinner

`SpinnerProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `size?`: `BearSize`
- `className?`: `string`
- `color?`: `string`
- `label?`: `string`

### SplitButton

_No dedicated Props interface found in source._

### Spoiler

_No dedicated Props interface found in source._

### Spotlight

`SpotlightProps` extends ``

- `id?`: `string`
- `actions`: `SpotlightAction[]`
- `open?`: `boolean`
- `onOpenChange?`: `(open: boolean) => void`
- `placeholder?`: `string`
- `shortcutKey?`: `string`
- `shortcutMod?`: `boolean`
- `nothingFoundMessage?`: `string`
- `highlightMatches?`: `boolean`
- `limit?`: `number`
- `filter?`: `(query: string, actions: SpotlightAction[]) => SpotlightAction[]`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### StatCard

_No dedicated Props interface found in source._

### Statistic

`StatisticProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `title`: `string`
- `value`: `string | number`
- `prefix?`: `ReactNode`
- `suffix?`: `ReactNode`
- `icon?`: `ReactNode`
- `trend?`: `{ value: number; isUpward?: boolean }`
- `description?`: `string`
- `loading?`: `boolean`
- `precision?`: `number`
- `className?`: `string`
- `size?`: `'sm' | 'md' | 'lg'`
- `variant?`: `'default' | 'card' | 'minimal'`

### Stepper

`StepperControlsProps` extends ``

- `activeStep`: `number`
- `totalSteps`: `number`
- `onPrev`: `() => void`
- `onNext`: `() => void`
- `onComplete?`: `() => void`
- `disablePrev?`: `boolean`
- `disableNext?`: `boolean`
- `prevLabel?`: `string`
- `nextLabel?`: `string`
- `completeLabel?`: `string`
- `showIndicator?`: `boolean`
- `indicatorFormat?`: `(current: number, total: number) => string`

### Switch

`SwitchGroupProps` extends ``

- `value`: `string`
- `options`: `SwitchGroupOption[]`
- `onChange`: `(value: string) => void`
- `size?`: `'sm' | 'md' | 'lg'`
- `orientation?`: `SwitchOrientation`
- `disabled?`: `boolean`
- `className?`: `string`
- `testId?`: `string`

### TableSkeleton

`TableSkeletonProps` extends ``

- `rows?`: `number`
- `columns?`: `number`
- `animation?`: `SkeletonAnimation`
- `id?`: `string`
- `testId?`: `string`
- `className?`: `string`

### Tabs

`TabsProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `value?`: `string`
- `defaultTab`: `string`
- `variant?`: `'line' | 'pills' | 'enclosed'`
- `onChange?`: `(tabId: string) => void`
- `className?`: `string`
- `testId?`: `string`

### TagCloud

_No dedicated Props interface found in source._

### TagsInput

`TagsInputProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `value?`: `string[]`
- `defaultValue?`: `string[]`
- `onChange?`: `(tags: string[]) => void`
- `onAdd?`: `(tag: string) => void`
- `onRemove?`: `(tag: string, index: number) => void`
- `placeholder?`: `string`
- `disabled?`: `boolean`
- `maxTags?`: `number`
- `minLength?`: `number`
- `maxLength?`: `number`
- `separators?`: `string[]`
- `size?`: `'sm' | 'md' | 'lg'`
- `fullWidth?`: `boolean`
- `className?`: `string`

### Terminal

`TerminalProps` extends ``

- `id?`: `string`
- `lines`: `TerminalLine[]`
- `onCommand?`: `(command: string) => void`
- `cwd?`: `string`
- `user?`: `string`
- `host?`: `string`
- `prompt?`: `string | ReactNode`
- `title?`: `string`
- `showHeader?`: `boolean`
- `showLineNumbers?`: `boolean`
- `showTimestamps?`: `boolean`
- `readOnly?`: `boolean`
- `height?`: `number | string`
- `theme?`: `'dark' | 'light' | 'matrix'`
- `history?`: `string[]`
- `onHistoryChange?`: `(history: string[]) => void`
- `autoScroll?`: `boolean`
- `className?`: `string`
- `testId?`: `string`
- `isLoading?`: `boolean`

### ThemeIcon

`ThemeIconProps` extends ``

- `id?`: `string`
- `children`: `ReactNode`
- `variant?`: `BearVariant | (string & {})`
- `size?`: `BearSize | number`
- `radius?`: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `gradient?`: `{ from: string; to: string; deg?: number }`
- `className?`: `string`
- `testId?`: `string`

### TimePicker

`TimePickerColumnsProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `selectedHour`: `number`
- `setSelectedHour`: `(h: number) => void`
- `selectedMinute`: `number`
- `setSelectedMinute`: `(m: number) => void`
- `period`: `'AM' | 'PM'`
- `setPeriod`: `(p: 'AM' | 'PM') => void`
- `format`: `TimePickerFormat`
- `hours`: `number[]`
- `minutes`: `number[]`
- `timeValue?`: `string`
- `clearable`: `boolean`
- `onChange?`: `(time: string | null) => void`
- `onConfirm`: `() => void`
- `onClose`: `() => void`
- `translations?`: `TimePickerTranslations`

### Timeline

_No dedicated Props interface found in source._

### TimelineChart

_No dedicated Props interface found in source._

### Toast

`ToastProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `message`: `ReactNode`
- `title?`: `string`
- `severity?`: `ToastSeverity`
- `duration?`: `number`
- `closable?`: `boolean`
- `icon?`: `ReactNode | false`
- `action?`: `ReactNode`
- `onClose?`: `() => void`
- `className?`: `string`
- `autoScroll?`: `boolean`
- `pauseOnHover?`: `boolean`

### ToggleButton

`ToggleButtonGroupProps` extends ``

- `value?`: `string | string[]`
- `defaultValue?`: `string | string[]`
- `onChange?`: `(value: string | string[]) => void`
- `exclusive?`: `boolean`
- `size?`: `BearSize`
- `fullWidth?`: `boolean`
- `disabled?`: `boolean`
- `className?`: `string`
- `id?`: `string`
- `testId?`: `string`
- `children?`: `ReactNode`

### Tooltip

`TooltipProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `content`: `ReactNode`
- `children`: `ReactNode`
- `position?`: `'top' | 'bottom' | 'left' | 'right'`
- `placement?`: `'top' | 'bottom' | 'left' | 'right'`
- `delay?`: `number`
- `className?`: `string`
- `disabled?`: `boolean`

### Tour

`TourProps` extends ``

- `id?`: `string`
- `steps`: `TourStep[]`
- `open?`: `boolean`
- `current?`: `number`
- `onClose?`: `() => void`
- `onStepChange?`: `(current: number) => void`
- `onFinish?`: `() => void`
- `showIndicators?`: `boolean`
- `showCloseButton?`: `boolean`
- `showSkipButton?`: `boolean`
- `showPrevButton?`: `boolean`
- `finishText?`: `string`
- `skipText?`: `string`
- `className?`: `string`
- `maskOpacity?`: `number`
- `maskColor?`: `string`
- `animated?`: `boolean`
- `testId?`: `string`

### TransferList

_No dedicated Props interface found in source._

### Transition

`TransitionProps` extends ``

- `id?`: `string`
- `show`: `boolean`
- `name?`: `TransitionName`
- `duration?`: `number`
- `delay?`: `number`
- `easing?`: `string`
- `enterFrom?`: `CSSProperties`
- `enterTo?`: `CSSProperties`
- `leaveFrom?`: `CSSProperties`
- `leaveTo?`: `CSSProperties`
- `unmountOnHide?`: `boolean`
- `onEnter?`: `() => void`
- `onEntered?`: `() => void`
- `onLeave?`: `() => void`
- `onLeft?`: `() => void`
- `children`: `ReactNode`
- `className?`: `string`
- `as?`: `keyof JSX.IntrinsicElements`

### TreeSelect

`TreeNodeRowProps` extends ``

- `node`: `TreeNode`
- `depth`: `number`
- `selected`: `Set<string>`
- `expanded`: `Set<string>`
- `multiple`: `boolean`
- `onToggleExpand`: `(id: string) => void`
- `onSelect`: `(id: string) => void`

### TreeView

`TreeViewProps` extends ``

- `testId?`: `string`
- `id?`: `string`
- `data`: `TreeNode[]`
- `onSelect?`: `(node: TreeNode) => void`
- `onExpand?`: `(nodeId: string, expanded: boolean) => void`
- `selectedId?`: `string`
- `expandedIds?`: `string[]`
- `defaultExpandedIds?`: `string[]`
- `multiSelect?`: `boolean`
- `selectedIds?`: `string[]`
- `showCheckboxes?`: `boolean`
- `onCheck?`: `(nodeId: string, checked: boolean) => void`
- `checkedIds?`: `string[]`
- `className?`: `string`
- `size?`: `'sm' | 'md' | 'lg'`
- `showLines?`: `boolean`

### Typewriter

`TypewriterProps` extends ``

- `id?`: `string`
- `text`: `string | string[]`
- `speed?`: `number`
- `startDelay?`: `number`
- `deleteDelay?`: `number`
- `deleteSpeed?`: `number`
- `loop?`: `boolean`
- `cursor?`: `boolean`
- `cursorChar?`: `string`
- `cursorBlinkSpeed?`: `number`
- `onComplete?`: `() => void`
- `onWordComplete?`: `(index: number) => void`
- `as?`: `'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`

### Typography

_No dedicated Props interface found in source._

### VirtualList

_No dedicated Props interface found in source._

### VisuallyHidden

`VisuallyHiddenProps` extends ``

- `children`: `ReactNode`

### Watermark

`WatermarkProps` extends ``

- `id?`: `string`
- `children?`: `ReactNode`
- `text?`: `string | string[]`
- `image?`: `string`
- `fontSize?`: `number`
- `color?`: `string`
- `rotate?`: `number`
- `opacity?`: `number`
- `patternRepeat?`: `number`
- `gap?`: `[number, number]`
- `offset?`: `[number, number]`
- `zIndex?`: `number`
- `fontFamily?`: `string`
- `fontWeight?`: `number | string`
- `visible?`: `boolean`
- `className?`: `string`
- `style?`: `React.CSSProperties`
- `testId?`: `string`
