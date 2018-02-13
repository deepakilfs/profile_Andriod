package adapters;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.support.v7.widget.AppCompatTextView;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import com.tsdg.ilfsets.emp_profile.R;
import java.util.ArrayList;

import app.AnalyticsTrackers;
import app.AppController;
import app.TrackerHelper;
import model.AllNotifications;
import model.NotificationIds;

public class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.ViewHolder> {
        public static ArrayList<AllNotifications> mDataset;
        public Context mContext;
        public static ArrayList<NotificationIds>notificationIds=new ArrayList<NotificationIds>();
        // Provide a reference to the views for each data item
        // Complex data items may need more than one view per item, and
        // you provide access to all the views for a data item in a view holder
        public class ViewHolder extends RecyclerView.ViewHolder {
            // each data item is just a string in this case

            AppCompatTextView title,desc,history;
            CardView cardView;
            public ViewHolder(View v) {
                super(v);
                title= (AppCompatTextView) v.findViewById(R.id.noti_title);
                desc= (AppCompatTextView) v.findViewById(R.id.noti_txt_desc);
                history= (AppCompatTextView) v.findViewById(R.id.txt_noti_history);
                cardView= (CardView) v.findViewById(R.id.card_view);

            }
        }

        // Provide a suitable constructor (depends on the kind of dataset)
        public NotificationAdapter(Context context,ArrayList<AllNotifications> myDataset){
            mContext=context;
            mDataset = myDataset;
            readNotification();
        }

        // Create new views (invoked by the layout manager)
        @Override
        public NotificationAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                       int viewType) {
            // create a new view
            View v=LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.notification_list_row, parent, false);
            // set the view's size, margins, paddings and layout parameters
            ViewHolder vh = new ViewHolder(v);
            return vh;
        }

        // Replace the contents of a view (invoked by the layout manager)
        @Override
        public void onBindViewHolder(ViewHolder holder, int position){
            // - get element from your dataset at this position
            // - replace the contents of the view with that element
            AllNotifications allNotifications=mDataset.get(position);
            holder.title.setText(allNotifications.getTitle());
            holder.desc.setText(allNotifications.getDesc());
            holder.history.setText(allNotifications.getNoti_date());

        }

        // Return the size of your dataset (invoked by the layout manager)
        @Override
        public int getItemCount() {

            return mDataset.size();
        }

        public void readNotification()
        {
            for(int i=0;i<mDataset.size();i++)
            {
                NotificationIds noti_id=new NotificationIds();
                noti_id.setIds(mDataset.get(i).getId());
                notificationIds.add(noti_id);
            }

        }

    }