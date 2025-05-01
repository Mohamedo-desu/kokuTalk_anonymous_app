import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, View } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { StyleSheet } from 'react-native-unistyles';

// Define the props interface
interface RichTextEditorProps {
  editorRef: React.RefObject<RichEditor>;
  onChange: (text: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ editorRef, onChange }) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.undo,
          actions.line,
          actions.heading1,
          actions.heading4,
          actions.setParagraph,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
          [actions.setParagraph]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>P</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        // Use getEditor prop to supply the editor reference
        getEditor={() => editorRef.current}
        disabled={false}
        selectedIconTint={Colors.primary}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={'Write something...'}
        onChange={onChange}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create((theme, rt) => ({
  richBar: {
    backgroundColor: theme.Colors.gray[100],
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: theme.Colors.gray[200],
  },
  contentStyle: {
    color: theme.Colors.typography,
    placeholderColor: theme.Colors.gray[400],
    backgroundColor: theme.Colors.gray[100],
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
}));
