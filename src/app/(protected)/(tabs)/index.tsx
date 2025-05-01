import Empty from '@/components/common/Empty';
import Loader from '@/components/common/Loader';
import RenderConfessionCard from '@/components/common/RenderConfessionCard';
import { usePaginatedQuery } from 'convex/react';
import React from 'react';

import { useRouter } from 'expo-router';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { api } from '../../../../convex/_generated/api';

const HomeScreen = () => {
  const {
    results: confessions,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.confessions.getPublicConfessions,
    {},
    {
      initialNumItems: 10,
    }
  );

  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <Animated.FlatList
      data={confessions}
      renderItem={({ item, index }) => (
        <RenderConfessionCard
          item={item}
          themeColors={theme.Colors}
          index={index}
          router={router}
        />
      )}
      keyExtractor={item => item._id}
      style={styles.flatList}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      onEndReached={() => loadMore(10)}
      ListEmptyComponent={
        isLoading ? <Loader size="small" /> : <Empty text="Start creating confessions" />
      }
      ListFooterComponent={
        status === 'LoadingMore' ? (
          <Loader size="small" />
        ) : status === 'Exhausted' && confessions.length !== 0 ? (
          <Empty text="No more confessions" />
        ) : null
      }
      itemLayoutAnimation={LinearTransition}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create((theme, rt) => ({
  flatList: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: theme.Colors.background,
    paddingHorizontal: 15,
    gap: 10,
    paddingBottom: rt.insets.bottom + 40,
    paddingTop: 20,
  },
}));
